import PaymentComponent from "@/components/payment/stripePayment";
import * as React from "react";

async function Payment(props: Readonly<{ params: Promise<{ clientSecret: string }> }>) {
  const params = await props.params;
  return (
    <div id="checkout" className="p-4">
      <PaymentComponent clientSecret={params.clientSecret} />
    </div>
  );
}

export default Payment;
