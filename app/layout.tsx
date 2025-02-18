/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "@/app/globals.css";
import CartProvider from "@/utils/cartProvider";
import { ModalProvider } from "@/utils/modalProvider";
import { Toaster } from "@/components/ui/toaster";
import NavBarClient from "@/components/navBar/navbar";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop",
};

export default async function Layout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{
      lang: string;
    }>;
  }>
) {
  const params = await props.params;

  const { lang } = params;

  const { children } = props;

  return (
    <ModalProvider>
      <CartProvider>
        <html lang={lang}>
          <HeadElement />
          <body className={"font-playfair flex flex-col relative"}>
            <NavBarClient lang={lang} />
            <main className="[&>*]:px-4 md:[&>*]:px-[10%] flex-1">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
            <div className="mt-4">
              <div className="h-4 bg-primary" />
            </div>
            <Toaster />
          </body>
        </html>
      </CartProvider>
    </ModalProvider>
  );
}

function HeadElement() {
  return (
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&display=swap"
        rel="stylesheet"
      />
    </head>
  );
}
