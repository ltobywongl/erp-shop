import NavBarClient from "./client";

export default async function NavBar(params: Readonly<{ lang: string }>) {

  return <NavBarClient lang={params.lang} />;
}
