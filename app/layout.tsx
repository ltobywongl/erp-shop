import NavBar from "@/components/navBar/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import CartProvider from "@/utils/cartProvider";
import { ModalProvider } from "@/components/common/modal";
import { cn } from "@/utils/utils";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop",
};

export default function Layout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: {
    lang: string;
  };
}>) {
  return (
    <ModalProvider>
      <CartProvider>
        <AntdRegistry>
          <html lang={lang}>
            <body className={cn(playfair.className, "flex flex-col")}>
              <NavBar lang={lang} />
              {children}
              <div className="mt-4 flex-1 flex flex-col justify-end">
                <div className="h-4 bg-emerald-800" />
              </div>
            </body>
          </html>
        </AntdRegistry>
      </CartProvider>
    </ModalProvider>
  );
}
