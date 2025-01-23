import NavBarClient from "./client";

export default async function NavBar(params: { lang: string }) {

  return <NavBarClient lang={params.lang} />;
}
