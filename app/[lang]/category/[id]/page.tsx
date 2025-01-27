import CategoryListPage from "@/components/category/list";

async function Page(props: Readonly<{ params: Promise<{ id: string }> }>) {
  const params = await props.params;
  return <CategoryListPage id={params.id} />;
}

export default Page;
