import NavBar from "@/components/navBar/server";
import type { Metadata } from "next";
import { Playfair } from "next/font/google";
import "@/app/globals.css";
import CartProvider from "@/utils/cartProvider";
import { ModalProvider } from "@/utils/modalProvider";
import { cn } from "@/utils/utils";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair({ subsets: ["latin"] });

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
          <body className={cn(playfair.className, "flex flex-col")}>
            <NavBar lang={lang} />
            {children}
            <div className="mt-4 flex-1 flex flex-col justify-end">
              <div className="h-4 bg-primary" />
            </div>
            <Toaster />
          </body>
        </html>
      </CartProvider>
    </ModalProvider>
  );
}
