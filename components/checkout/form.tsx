"use client";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslation } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { SelectItem, SelectValue } from "@radix-ui/react-select";

export default function CheckoutForm({
  lang,
  coupons,
}: Readonly<{
  lang: string;
  coupons: Coupon[];
}>) {
  const router = useRouter();
  const { t } = useTranslation(lang, "checkout");
  const cartContext = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { totalPrice, totalQuantity, totalPoint } = cartContext?.cart.reduce(
    (acc, item) => {
      return {
        totalPrice: acc.totalPrice + item.sellingPrice * item.quantity,
        totalQuantity: acc.totalQuantity + item.quantity,
        totalPoint: acc.totalPoint + (item.couponPoint ?? 0) * item.quantity,
      };
    },
    { totalPrice: 0, totalQuantity: 0, totalPoint: 0 }
  ) || { totalPrice: 0, totalQuantity: 0, totalPoint: 0 };
  const filteredCoupons = coupons.filter(
    (coupon) => !coupon.minCheckValue || coupon.minCheckValue <= totalPrice
  );
  const [couponValue, setCouponValue] = useState(0);
  const finalPrice = totalPrice - couponValue;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const data: any = {};
    data.coupon = (
      e.currentTarget.elements.namedItem("coupon") as HTMLInputElement
    ).value;
    data.name = (
      e.currentTarget.elements.namedItem("name") as HTMLInputElement
    ).value;
    data.address = (
      e.currentTarget.elements.namedItem("address") as HTMLInputElement
    ).value;
    data.price = finalPrice.toString();
    data.cart = JSON.stringify(cartContext?.cart);
    data.locale = lang;
    const response = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (response.ok && resData.success) {
      setError("");
      cartContext.setcart([]);
      router.push(`/payment/${resData.body}`);
    } else {
      setError(resData.error);
    }
    setIsLoading(false);
  }

  function handleCoupon(id: string) {
    const coupon = coupons.find((coupon) => coupon.id === id);
    setCouponValue(coupon?.value ?? 0);
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 py-2">
      <div className="border-b md:border-r md:border-b-0 px-2 w-full md:w-1/2">
        <h1 className="text-xl md:text-2xl font-bold">{t("shoppingCart")}</h1>
        <hr className="my-1" />
        {totalQuantity === 0 ? (
          <div>{t("shoppingCartIsEmpty")}</div>
        ) : (
          cartContext?.cart.map((item) => (
            <SmallItemCard
              item={item}
              key={item.id}
              className="py-2"
              lang={lang}
            />
          ))
        )}
      </div>
      <div className="px-2 w-full md:w-1/3">
        <div className="font-bold">{t("orderDetails")}</div>
        <form className="flex flex-col gap-1" onSubmit={(e) => handleSubmit(e)}>
          <hr className="my-1" />
          <div>
            <label htmlFor="coupon">{t("coupon")}</label>
            <Select onValueChange={(value) => handleCoupon(value)}>
              <SelectTrigger id="coupon" name="coupon">
                <SelectValue placeholder={t("selectACoupon")} />
              </SelectTrigger>
              <SelectContent>
                {filteredCoupons?.map((coupon) => {
                  return (
                    <SelectItem value={coupon.id} key={`coupon-${coupon.id}`}>
                      {coupon.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <hr className="my-1" />
          <div className="text-xl md:text-2xl">HKD ${finalPrice}</div>
          {totalPoint > 0 && (
            <div>
              <span>{t("pointsEarned")}</span>
              <span className="text-red-500 ml-1">{totalPoint}</span>
            </div>
          )}
          <hr className="my-1" />
          <label htmlFor="name">{t("receiverName")}</label>
          <Input type="text" id="name" name="name" required />
          <label htmlFor="address">{t("receiverAddress")}</label>
          <Input type="text" id="address" name="address" required />
          <p className="text-sm text-red-500">{error}</p>
          <Button
            type="submit"
            loading={isLoading}
            disabled={totalQuantity === 0}
          >
            {t("send")}
          </Button>
          <p className="text-sm text-primary">
            {t("youCanContinuePaymentAnytimeInOrderHistoryPage")}
          </p>
        </form>
      </div>
    </div>
  );
}
