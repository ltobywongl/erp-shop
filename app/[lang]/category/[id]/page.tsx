import CategoryListPage from "@/components/category/list";

async function Page(props: Readonly<{ params: Promise<{ id: string, lang: string }> }>) {
  const params = await props.params;
  return <CategoryListPage id={params.id} lang={params.lang} />;
}

export default Page;
