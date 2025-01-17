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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ModalProvider>
      <CartProvider>
        <html lang="en">
          <AntdRegistry>
            <body className={cn(playfair.className, "flex flex-col")}>
              <NavBar />
              {children}
              <div className="mt-4 flex-1 flex flex-col justify-end">
                <div className="h-4 bg-emerald-800"></div>
              </div>
            </body>
          </AntdRegistry>
        </html>
      </CartProvider>
    </ModalProvider>
  );
}
