import { errorResponse, successResponse } from "@/utils/httpResponse";
import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { loadUser } from "@/utils/user";
import prisma from "@/utils/prisma";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const user = await loadUser();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }
    
    const data = await req.json();
    const { amount } = data;
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: "HKD",
              product_data: {
                name: 'Checkout',
              },
              unit_amount: amount,
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_BASE_URL}/billing`,
        cancel_url: `${process.env.NEXT_BASE_URL}/billing`,
        metadata: {
          userId: user.id,
        }
      });

    await prisma.payment.create({
      data: {
        id: checkoutSession.id,
        userId: user.id,
        amount: amount,
        state: PaymentStates.PENDING,
      }
    });

    return successResponse(checkoutSession.id, 200);
  } catch (error: any) {
    console.error(error);
    return errorResponse("Internal Server Error", 500);
  }
}
