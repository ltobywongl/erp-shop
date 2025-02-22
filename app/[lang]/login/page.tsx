import Login from "@/components/login/login";

export default async function Page(
  props: Readonly<{
    params: Promise<{ lang: string }>;
  }>
) {
  const params = await props.params;
  return <Login lang={params.lang} />;
}
