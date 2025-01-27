import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

console.log("Stripe API Key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

async function Payment(props: Readonly<{ params: Promise<{ clientSecret: string }> }>) {
  const params = await props.params;
  console.log("Client Secret:", params.clientSecret);
  return (
    <div id="checkout" className="p-4">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret: params.clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default Payment;
