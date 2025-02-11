import { errorResponse, successResponse } from "@/utils/httpResponse";
import Stripe from "stripe";
import { NextRequest } from "next/server";
import { loadUser } from "@/utils/user";
import prisma from "@/utils/prisma";
import { PaymentStates } from "@/constants/payment";
import { OrderStates } from "@/constants/order";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const user = await loadUser();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { orderId } = await request.json();

    if (!orderId || typeof orderId !== "string") {
      return errorResponse("Bad Request", 400);
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
        state: OrderStates.PAYMENT_PENDING,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      return errorResponse("No such order or order is paid", 400);
    }

    // if order created within 30 days, retrieve the session through stripe directly
    if (
      order.payment?.createdAt &&
      new Date(order.payment.createdAt).getTime() >
        Date.now() - 30 * 24 * 60 * 60 * 1000 &&
      [PaymentStates.PENDING, PaymentStates.FAILED].includes(
        order.payment.state as PaymentStates
      )
    ) {
      try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          order.payment.id
        );
        return successResponse(checkoutSession.client_secret ?? "");
      } catch (error: any) {
        return errorResponse("Internal Server Error", 500);
      }
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "HKD",
              product_data: {
                name: "Checkout",
              },
              unit_amount: order.totalPrice * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        ui_mode: "embedded",
        return_url: `${process.env.NEXT_BASE_URL}/account/order-history`,
        metadata: {
          userId: user.id,
        },
      });

    await prisma.$transaction(
      async (tx) => {
        await tx.payment.create({
          data: {
            id: checkoutSession.id,
            userId: user.id,
            amount: order.totalPrice,
            state: PaymentStates.PENDING,
          },
        });

        await tx.order.update({
          data: {
            paymentId: checkoutSession.id,
          },
          where: {
            id: orderId,
          },
        });
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
