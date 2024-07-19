import CategoryListPage from "@/components/category/list";

async function Page({ params }: { params: { id: string } }) {
  return <CategoryListPage id={params.id} />;
}

export default Page;
