import Stripe from "stripe";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { PaymentStates } from "@/constants/payment";
import { OrderStates } from "@/constants/order";
type METADATA = {
  userId: string;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
    const sig = (await headers()).get("stripe-signature") as string;
    
    let event: Stripe.Event;
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    let success: boolean;
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        success = true;
        break;
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        success = false;
        break;
      default:
        return errorResponse("Unhandled event type", 400);
    }

    const data = event.data.object;
    const metadata = data.metadata as METADATA;
    const userId = metadata.userId;

    await prisma.payment.update({
      data: {
        state: success ? PaymentStates.SUCCESS : PaymentStates.FAILED,
      },
      where: {
        id: data.id,
        userId: userId,
      },
    });

    await prisma.order.updateMany({
      data: {
        state: OrderStates.CONFIRM,
      },
      where: {
        paymentId: data.id,
      }
    });

    // database update here
    return successResponse("Success", 200);
  } catch (error) {
    return errorResponse("Internal Server Error", 500);
  }
}
