import NotFound from "@/app/not-found";
import ProductDetails from "@/components/product/details";
import { getProductById } from "@/utils/products/products";

async function Page(props: Readonly<{ params: Promise<{ id: string, lang: string }> }>) {
  const params = await props.params;
  const product = await getProductById(params.id, params.lang, true);

  if (!product) return <NotFound />;

  return (
    <div className="flex justify-center py-2">
      <div className="w-full md:w-4/5">
        <ProductDetails item={product} lang={params.lang} />
      </div>
    </div>
  );
}

export default Page;
