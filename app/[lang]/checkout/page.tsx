import CheckoutForm from "@/components/checkout/form";
import { getRewardsByUserId } from "@/utils/rewards/rewards";
import { loadUser } from "@/utils/user";
import { redirect } from "next/navigation";

async function Page(props: Readonly<{ params: Promise<{ lang: string }> }>) {
  const user = await loadUser();
  if (!user) {
    return redirect("/login");
  }
  const params = await props.params;

  const coupons = await getRewardsByUserId(params.lang, user.id);
  const filteredCoupons = coupons.filter(
    (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
  );

  return <CheckoutForm lang={params.lang} coupons={filteredCoupons} />;
}

export default Page;
