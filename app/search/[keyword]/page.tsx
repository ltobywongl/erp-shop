import SearchPage from "@/components/search/list";

async function Page({ params }: { params: { keyword: string } }) {
  return <SearchPage keyword={params.keyword} />;
}

export default Page;
