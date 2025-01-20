import SuggestPage from "@/components/suggest/suggest";

async function Page({ params }: { params: { lang: string } }) {
  return <SuggestPage lang={params.lang} />;
}

export default Page;
