import ForgetPassword from "@/components/forgetPassword/forgetPassword";

export default async function Page(
  props: Readonly<{
    params: Promise<{ lang: string }>;
  }>
) {
  const params = await props.params;
  return <ForgetPassword lang={params.lang} />;
}
