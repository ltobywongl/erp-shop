import SearchPage from "@/components/search/list";

async function Page(props: { params: Promise<{ lang: string; keyword: string }> }) {
  const params = await props.params;
  return <SearchPage lang={params.lang} keyword={params.keyword} />;
}

export default Page;
