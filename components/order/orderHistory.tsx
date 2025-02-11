"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { OrderStates } from "@/constants/order";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function OrderHistoryOrder({
  order,
}: Readonly<{
  order: Order;
}>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleRepay() {
    setLoading(true);
    const response = await fetch(`/api/checkout/repay`, {
      method: "POST",
      body: JSON.stringify({ orderId: order.id }),
    });

    const resData = await response.json();
    setLoading(false);
    if (response.ok && resData.success) {
      router.push(`/payment/${resData.body}`);
    } else {
      toast(resData.error);
    }
  }

  return (
    <div className="p-3 border rounded-lg" key={order.id}>
      <div>
        {order.state === OrderStates.PAYMENT_PENDING && (
          <>
            <Button loading={loading} onClick={handleRepay}>重新支付</Button>
          </>
        )}
      </div>
      <div>
        <div className="font-bold flex justify-between">
          <div>下單日期 {order.createdAt.toLocaleDateString()}</div>
          <div>訂單狀態: {order.state}</div>
        </div>
        <div>價格: ${order.totalPrice}</div>
        <div>
          送往 {order.receiverName}, {order.receiverAddress}
        </div>
        <hr className="my-1" />
        <div>
          <div className="font-bold">明細</div>
          {order.products.map((item) => {
            return (
              <div key={item.id}>
                {item.quantity}件 {item.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
