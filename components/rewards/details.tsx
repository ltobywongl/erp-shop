"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/spinner";
import MyImage from "@/components/image/customImage";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/client";
import { useToast } from "@/hooks/use-toast";

function RewardDetails({
  lang,
  item,
}: Readonly<{ lang: string; item: CouponCategory }>) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(lang, "coupons");

  async function handleRedeem() {
    setIsLoading(true);
    const res = await fetch("/api/rewards/redeem", {
      method: "POST",
      body: JSON.stringify({
        id: item.id,
      }),
    });
    setIsLoading(false);

    if (res.ok) {
      toast({ title: t("redeemed") });
    } else {
      toast({ title: t("failedToRedeem"), variant: "destructive" });
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full">
        {item.imagePath ? (
          <MyImage
            src={item.imagePath}
            alt={item.name || "Coupon"}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-32 md:!max-h-64 w-full"
            externalUrl
          />
        ) : (
          <div className="w-[25%] md:w-full border-4 border-double text-xl md:text-2xl text-center font-semibold md:font-bold bg-gradient-radial from-yellow-200 to-yellow-500 p-1 md:p-4 shadow-sm">
            ${item.value}
          </div>
        )}
      </div>
      <div className="flex flex-col ml-4 md:ml-0">
        <div className="flex items-end gap-4">
          <h1 className="text-zinc-800 font-bold text-2xl md:text-3xl">
            {item.name}
          </h1>
          <div className="text-red-500 font-bold">
            ({item.point} {t("points")})
          </div>
          {item.useStock && (
            <div className="text-zinc-500">
              {t("inStock")}: {item.stock}
            </div>
          )}
        </div>
        {item.minCheckValue && (
          <div>
            {t("minimumCharge")}: {item.minCheckValue}
          </div>
        )}
        <div>{item.description}</div>
        <Button onClick={() => handleRedeem()} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : t("exchange")}
        </Button>
      </div>
    </div>
  );
}

export default RewardDetails;
