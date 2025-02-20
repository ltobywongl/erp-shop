import { errorResponse, successResponse } from "@/utils/httpResponse";
import Stripe from "stripe";
import { NextRequest } from "next/server";
import { loadUser } from "@/utils/user";
import prisma from "@/utils/prisma";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { PaymentStates } from "@/constants/payment";
import { OrderStates } from "@/constants/order";
import { getProductsByIds } from "@/utils/products/products";
import { fallbackLang, languages, Locale } from "@/i18n/settings";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const user = await loadUser();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { error, data, totalPoint, totalPrice, cart } =
      await readData(request);

    if (error || !data) {
      return errorResponse(error.message, 400);
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["alipay", "wechat_pay", "card"],
        line_items: [
          {
            price_data: {
              currency: "HKD",
              product_data: {
                name: "Checkout",
              },
              unit_amount: totalPrice * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        ui_mode: "embedded",
        locale: data.locale,
        return_url: `${process.env.NEXT_BASE_URL}/account/order-history`,
        metadata: {
          userId: user.id,
        },
      });

    const orderId = createId();

    await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            couponPoints: {
              increment: totalPoint,
            },
          },
        });

        await tx.payment.create({
          data: {
            id: checkoutSession.id,
            userId: user.id,
            amount: totalPrice,
            state: PaymentStates.PENDING,
          },
        });

        await tx.order.create({
          data: {
            id: orderId,
            userId: user.id,
            totalPrice: totalPrice,
            couponId: data.coupon == "" ? null : data.coupon,
            paymentId: checkoutSession.id,
            state: OrderStates.PAYMENT_PENDING,
            receiverName: data.name,
            receiverAddress: data.address,
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

        for (const product of cart) {
          if (!product.useStock) continue;
          await tx.product.update({
            where: {
              id: product.id,
            },
            data: {
              stock: {
                decrement: product.quantity,
              },
            },
          });
        }
      },
      {
        timeout: 20000,
      }
    );

    return successResponse(checkoutSession.client_secret ?? "");
  } catch (error: any) {
    console.error(error);
    return errorResponse("Internal Server Error", 500);
  }
}

async function readData(request: NextRequest) {
  try {
    const Schema = z.object({
      price: z.string().refine(
        (v) => {
          let n = Number(v);
          return !isNaN(n) && v?.length > 0;
        },
        { message: "Invalid number" }
      ),
      cart: z.string(),
      coupon: z.string(),
      name: z.string(),
      address: z.string(),
      locale: z.string(),
    });

    const jsonData = await request.json();
    const data = Schema.safeParse(jsonData);

    if (!data.success) {
      throw new Error("Invalid Data");
    }

    const cart: Item[] = JSON.parse(data.data.cart);

    const products = await getProductsByIds(cart.map((product) => product.id));

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
          throw new Error(`${product.name} Not in stock`);
        }
      } else {
        throw new Error(`Unknown item ${product.name}`);
      }
    }

    if (!products) {
      throw new Error("Unknown item");
    }

    if (data.data.coupon && data.data.coupon !== "") {
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
          id: data.data.coupon as string,
        },
      });

      if (!coupon) {
        throw new Error("Unknown coupon");
      }
      totalPrice -= coupon?.couponCategory.value;
    }

    if (parseFloat(data.data.price) !== totalPrice) {
      throw new Error("Invalid price");
    }

    if (!(languages as string[]).includes(data.data.locale)) {
      data.data.locale = fallbackLang;
    }

    return {
      data: data.data as {
        name: string;
        price: string;
        cart: string;
        coupon: string;
        address: string;
        locale: Locale;
      },
      totalPoint,
      totalPrice,
      products,
      cart,
      error: false,
    };
  } catch (error: any) {
    console.error(error);
    return {
      totalPoint: 0,
      totalPrice: 0,
      products: [],
      cart: [],
      error: error,
    };
  }
}
