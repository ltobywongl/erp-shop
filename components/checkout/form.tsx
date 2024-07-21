"use client";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import { Input } from "antd";
import { useRouter } from "next/navigation";
import { FormEvent, ChangeEvent, useState } from "react";
import LoadingSpinner from "@/components/common/spinner";
import { CouponCategory } from "@prisma/client";

export default function CheckoutForm({
  balance,
  coupons,
}: {
  balance: number;
  coupons: Partial<CouponCategory>[];
}) {
  const router = useRouter();
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
  const [couponValue, setCouponValue] = useState(0);
  const finalPrice = totalPrice - couponValue;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("price", finalPrice.toString());
    formData.append("cart", JSON.stringify(cartContext?.cart));
    const response = await fetch("/api/order/create", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }

  function handleCoupon(e: ChangeEvent<HTMLSelectElement>) {
    const id = e.currentTarget.value;
    const coupon = coupons.find((coupon) => coupon.id === id);
    setCouponValue(coupon?.value ?? 0);
  }

  return (
    <div className="w-full md:w-4/5 flex flex-col md:flex-row gap-2">
      <div className="border-b md:border-r md:border-b-0 px-2 w-full md:w-1/2">
        <h1 className="text-xl md:text-2xl font-bold">購物車</h1>
        <hr className="my-1" />
        {totalQuantity === 0 ? (
          <div>購物車是空的</div>
        ) : (
          cartContext?.cart.map((item) => (
            <SmallItemCard item={item} key={item.id} className="py-2" />
          ))
        )}
      </div>
      <div className="px-2 w-full md:w-1/3">
        <div className="font-bold">訂單摘要</div>
        <form className="flex flex-col gap-1" onSubmit={(e) => handleSubmit(e)}>
          <hr className="my-1" />
          <div>
            <label htmlFor="coupon">優惠卷</label>
            <select
              id="coupon"
              name="coupon"
              className="block w-full border border-[#d9d9d9] px-3 py-1 rounded"
              onChange={(e) => handleCoupon(e)}
              required
            >
              <option value="">不使用優惠卷</option>
              {coupons?.map((coupon) => {
                return (
                  <option value={coupon.id} key={`coupon-${coupon.id}`}>
                    {coupon.name}
                  </option>
                );
              })}
            </select>
          </div>
          <hr className="my-1" />
          <div>小計 ({totalQuantity}件商品):</div>
          <div className="text-xl md:text-2xl">HKD ${finalPrice}</div>
          <div>
            <span>獲得積分</span>
            <span className="text-red-500 ml-1">{totalPoint}</span>
            <span className="ml-1">點</span>
          </div>
          <hr className="my-1" />
          <div>你的賬戶結餘: ${balance}</div>
          {balance < finalPrice ? (
            <div className="text-red-500">
              請先充值或在提交訂單時附上轉賬記錄以完成你的購買
            </div>
          ) : (
            <div className="text-green-500">不需充值</div>
          )}
          <hr className="my-1" />
          <label htmlFor="name">收件人姓名</label>
          <Input type="text" id="name" name="name" required />
          <label htmlFor="address">收件人地址</label>
          <Input type="text" id="address" name="address" required />
          {balance < finalPrice && (
            <>
              <label htmlFor="transferAmount">轉賬額</label>
              <Input
                type="number"
                step={0.01}
                id="transferAmount"
                name="transferAmount"
                required
              />
              <label htmlFor="transfer">轉賬記錄</label>
              <Input type="file" id="transfer" name="transfer" required />
            </>
          )}
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="submit"
            className="w-full px-3 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white font-bold"
          >
            {isLoading ? <LoadingSpinner /> : "提交訂單"}
          </button>
        </form>
      </div>
    </div>
  );
}
