import SearchPage from "@/components/search/list";

async function Page({ params }: { params: { lang: string; keyword: string } }) {
  return <SearchPage lang={params.lang} keyword={params.keyword} />;
}

export default Page;
