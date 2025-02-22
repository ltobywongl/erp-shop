import { RedirectType, redirect } from "next/navigation";
import RewardsPage from "@/components/rewards/page";
import { loadUser } from "@/utils/user";
import { getRewards } from "@/utils/rewards/rewards";

async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const user = await loadUser();
  if (user) {
    const items = await getRewards(params.lang);

    return <RewardsPage lang={params.lang} point={user.couponPoints} items={items} />;
  } else {
    return redirect("/login", RedirectType.push);
  }
}

export default Page;
