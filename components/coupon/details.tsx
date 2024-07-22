"use client";
import Image from "next/image";
import { CouponCategory } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../common/spinner";

function CouponDetails({ item }: { item: Partial<CouponCategory> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRedeem() {
    setIsLoading(true);
    const res = await fetch("/api/coupons/redeem", {
      method: "POST",
      body: JSON.stringify({
        id: item.id,
      }),
    });
    setIsLoading(false);

    if (res.ok) {
      alert("已換領禮卷");
    } else {
      alert("換領失敗,請確定你的積分足夠並重試");
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="w-full text-zinc-800 font-bold text-xl md:text-2xl">
        {item.name}
      </h1>
      <div className="w-full">
        {item.imagePath ? (
          <Image
            src={item.imagePath}
            alt={`product-${item.id}`}
            height={400}
            width={400}
            className="aspect-square object-contain !max-h-32 md:!max-h-64 w-full"
          />
        ) : (
          <div className="w-[25%] md:w-full border-4 border-double text-xl md:text-2xl text-center font-semibold md:font-bold bg-gradient-radial from-yellow-200 to-yellow-500 p-1 md:p-4 shadow-sm">
            ${item.value}
          </div>
        )}
      </div>
      <div className="flex flex-col ml-4 md:ml-0">
        <div className="text-zinc-600">{item.description}</div>
        <div className="w-full text-red-400 mt-2">
          <span className="text-red-500 font-bold ml-1">{item.point}積分</span>
        </div>
        <div className="w-full text-zinc-500">剩餘{item.stock}件</div>
        <div className="w-full">
          <button
            className="bg-green-400 text-white rounded-sm py-1 px-3"
            onClick={() => handleRedeem()}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "兌換"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CouponDetails;
