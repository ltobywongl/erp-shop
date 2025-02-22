import ChangePassword from "@/components/changePassword/changePassword";

export default async function Page(
  props: Readonly<{
    params: Promise<{ lang: string }>;
  }>
) {
  const params = await props.params;
  return <ChangePassword lang={params.lang} />;
}
