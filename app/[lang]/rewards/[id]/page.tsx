import NotFound from "@/app/not-found";
import RewardDetails from "@/components/rewards/details";
import { getRewardById } from "@/utils/rewards/rewards";

async function Page(props: { params: Promise<{ id: string; lang: string }> }) {
  const params = await props.params;
  const couponCategory = await getRewardById(params.lang);

  if (!couponCategory) return <NotFound />;

  return (
    <div className="flex justify-center gap-2 py-2 px-2">
      <div className="w-full">
        <RewardDetails item={couponCategory} lang={params.lang} />
      </div>
    </div>
  );
}

export default Page;
