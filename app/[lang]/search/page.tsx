import SuggestPage from "@/components/suggest/suggest";

async function Page(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  return <SuggestPage lang={params.lang} />;
}

export default Page;
