import { sendMail } from "@/utils/email";
import { confirmEmail } from "@/utils/emails/confirm";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
import { NextRequest } from "next/server";
import { createId } from '@paralleldrive/cuid2';
import { loadUser } from "@/utils/user";

export async function POST(request: NextRequest) {
  try {
    const user = await loadUser();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      price: rawFormData.get("price"),
      cart: rawFormData.get("cart"),
      coupon: rawFormData.get("coupon"),
      name: rawFormData.get("name"),
      address: rawFormData.get("address"),
      transferAmount: rawFormData.get("transferAmount"),
      transfer: rawFormData.get("transfer"),
    };

    if (
      !formData.price ||
      !formData.cart ||
      typeof formData.coupon === "undefined" ||
      !formData.name ||
      !formData.address
    ) {
      return errorResponse("缺少資料", 400);
    }
    const cart: Item[] = JSON.parse(formData.cart as string);

    const products = await prisma.product.findMany({
      select: {
        id: true,
        price: true,
        useStock: true,
        stock: true,
        discount: true,
        couponPoint: true,
        category: {
          select: {
            id: true,
            discount: true,
          },
        },
      },
      where: {
        id: {
          in: cart.map((product) => product.id),
        },
      },
    });

    let totalPrice = 0;
    let totalPoint = 0;
    for (const product of cart) {
      const cartProduct = products.find((item) => item.id === product.id);
      if (cartProduct) {
        totalPrice +=
          (cartProduct.price -
            cartProduct.discount -
            cartProduct.category.discount) *
          product.quantity;
        totalPoint += cartProduct.couponPoint * product.quantity;
        if (cartProduct.useStock && cartProduct.stock < product.quantity) {
          return errorResponse(`庫存不足:${product.name}`, 400);
        }
      } else {
        return errorResponse(`未知的商品:${product.name}`, 400);
      }
    }

    if (!products) {
      return errorResponse("未知的商品", 400);
    }

    if (parseFloat(formData.price as string) !== totalPrice) {
      return errorResponse("金額錯誤", 400);
    }

    if (formData.coupon && formData.coupon !== "") {
      const coupon = await prisma.coupon.findUnique({
        select: {
          id: true,
          couponCategory: {
            select: {
              id: true,
              value: true,
            },
          },
        },
        where: {
          id: formData.coupon as string,
        },
      });

      if (!coupon) {
        return errorResponse("未知的優惠卷", 400);
      }
      totalPrice -= coupon?.couponCategory.value;
    }

    const needToTopup = user.balance < totalPrice;
    if (
      needToTopup &&
      (!formData.transfer ||
        !formData.transferAmount ||
        user.balance + parseFloat(formData.transferAmount as string) <
          totalPrice)
    ) {
      return errorResponse("餘額不足", 400);
    }
    const file = formData.transfer as File;

    const orderId = createId();
    await prisma.$transaction(async (tx) => {
      if (needToTopup) {
        const fileUUID = createId();
        const paymentId = createId();
        const path = `orders/payments/${user.id}/${fileUUID}`;

        await uploadBlob("tomshop-pub", path, file, file.type);

        await tx.topup.create({
          data: {
            id: paymentId,
            userId: user.id,
            amount: totalPrice,
            imagePath: path,
          },
        });

        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            balance: 0,
          },
        });

        await tx.order.create({
          data: {
            id: orderId,
            userId: user.id,
            totalPrice: totalPrice,
            couponId:
              formData.coupon == "" ? null : formData.coupon?.toString(),
            paymentId: paymentId,
            state: "TO_BE_PAID",
            receiverName: formData.name as string,
            receiverAddress: formData.address as string,
          },
        });

        await tx.orderItem.createMany({
          data: cart.map((product) => {
            return {
              id: createId(),
              orderId: orderId,
              productId: product.id,
              quantity: product.quantity,
            };
          }),
        });

        const data = cart.map((product) => {
          return tx.product.update({
            where: {
              id: product.id,
            },
            data: {
              stock: {
                decrement: product.quantity,
              },
            },
          });
        });

        await Promise.all(data);
      } else {
        await tx.order.create({
          data: {
            id: orderId,
            userId: user.id,
            totalPrice: totalPrice,
            couponId:
              formData.coupon == "" ? null : formData.coupon?.toString(),
            paymentId: null,
            state: "TO_BE_CONFIRMED",
            receiverName: formData.name as string,
            receiverAddress: formData.address as string,
          },
        });

        await tx.orderItem.createMany({
          data: cart.map((product) => {
            return {
              id: createId(),
              orderId: orderId,
              productId: product.id,
              quantity: product.quantity,
            };
          }),
        });

        await tx.user.update({
          data: {
            balance: {
              decrement: totalPrice,
            },
            couponPoints: {
              increment: totalPoint,
            },
          },
          where: {
            id: user.id,
          },
        });

        const data = cart.map((product) => {
          return tx.product.update({
            where: {
              id: product.id,
            },
            data: {
              stock: {
                decrement: product.quantity,
              },
            },
          });
        });

        await Promise.all(data);
      }
    });

    await sendMail(
      "Order Confirmation",
      user.email,
      await confirmEmail({
        id: orderId,
      })
    );

    return successResponse("Success", 200);
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
