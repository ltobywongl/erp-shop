import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/navBar/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

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
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <NavBar />
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
