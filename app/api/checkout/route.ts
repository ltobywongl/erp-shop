import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        balance: true,
      },
      where: {
        id: session.user.id,
      },
    });

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
    cart.forEach((product) => {
      const cartProduct = products.find((item) => item.id === product.id);
      if (cartProduct) {
        totalPrice += cartProduct.price * product.quantity;
        if (cartProduct.discount) {
          totalPrice -= cartProduct.discount * product.quantity;
        }
        if (cartProduct.couponPoint) {
          totalPoint += cartProduct.couponPoint * product.quantity;
        }
        if (cartProduct.category.discount) {
          totalPrice -= cartProduct.category.discount * product.quantity;
        }
        if (cartProduct.stock < product.quantity) {
          return errorResponse(`庫存不足:${product.name}`, 400);
        }
      } else {
        return errorResponse(`未知商品:${product.name}`, 400);
      }
    });

    if (!products) {
      return errorResponse("未知商品", 400);
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
        return errorResponse("未知優惠卷", 400);
      }
      totalPrice -= coupon?.couponCategory.value;
    }

    if (
      user.balance < totalPrice &&
      (!formData.transfer ||
        !formData.transferAmount ||
        user.balance + parseFloat(formData.transferAmount as string) <
          totalPrice)
    ) {
      return errorResponse("餘額不足", 400);
    }

    await prisma.$transaction(async (tx) => {
      const needToTopup = user.balance < totalPrice;

      if (needToTopup) {
        //TODO: upload transfer to s3 & create payment
        const fileUUID = uuid();
        const paymentId = uuid();
        const path = `/orders/payments/${user.id}/${fileUUID}`;
        await tx.topup.create({
          data: {
            id: paymentId,
            userId: user.id,
            amount: totalPrice,
            imagePath: path,
          },
        });

        await tx.order.create({
          data: {
            id: uuid(),
            userId: user.id,
            totalPrice: totalPrice,
            couponId: formData.coupon as string,
            paymentId: paymentId,
            receiverName: formData.name as string,
            receiverAddress: formData.address as string,
          },
        });

        //TODO: add point & remove balance to user after approved topup
      } else {
        await tx.order.create({
          data: {
            id: uuid(),
            userId: user.id,
            totalPrice: totalPrice,
            couponId: formData.coupon as string,
            paymentId: null,
            receiverName: formData.name as string,
            receiverAddress: formData.address as string,
          },
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
      }
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
