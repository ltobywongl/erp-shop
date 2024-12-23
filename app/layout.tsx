import NavBar from "@/components/navBar/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartProvider from "@/utils/cartProvider";
import { ModalProvider } from "@/components/common/modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop",
  description: "erp demo shop",
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
            <body className={inter.className}>
              <NavBar />
              {children}
            </body>
          </AntdRegistry>
        </html>
      </CartProvider>
    </ModalProvider>
  );
}
