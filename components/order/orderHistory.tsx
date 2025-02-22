"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { OrderStates } from "@/constants/order";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function OrderHistoryOrder(
  params: Readonly<{
    lang: string;
    order: Order;
  }>
) {
  const { t } = useTranslation(params.lang, "orderHistory");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleRepay() {
    setLoading(true);
    const response = await fetch(`/api/checkout/repay`, {
      method: "POST",
      body: JSON.stringify({ orderId: params.order.id }),
    });

    const resData = await response.json();
    setLoading(false);
    if (response.ok && resData.success) {
      router.push(`/payment/${resData.body}`);
    } else {
      toast({ title: resData.error, variant: "destructive" });
    }
  }

  return (
    <div className="p-3 border rounded-lg" key={params.order.id}>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div>
          {t("orderDate")}: {params.order.createdAt.toLocaleDateString()}
        </div>
        <div>
          {t("status")}: {t(params.order.state)}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div>
          {t("price")}: ${params.order.totalPrice}
        </div>
        {params.order.state === OrderStates.PAYMENT_PENDING && (
          <Button loading={loading} onClick={handleRepay}>
            {t("repay")}
          </Button>
        )}
      </div>
      <hr className="my-1" />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("details")}</AccordionTrigger>
          <AccordionContent>
            <div>
              {params.order.products.map((item) => {
                return (
                  <div key={item.id}>
                    {item.quantity}* {item.name}
                  </div>
                );
              })}
            </div>
            <div>
              {t("to")}: {params.order.receiverName}, {params.order.receiverAddress}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
