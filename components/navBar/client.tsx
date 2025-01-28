"use client";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Badge, Drawer } from "antd";
import { useState } from "react";
import Link from "next/link";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import useBigScreen from "@/utils/hooks/windowSize";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import LanguageSwitcher from "../common/langSwitcher";
import { useTranslation } from "@/i18n/client";
import MyImage from "../image/customImage";

function NavBarClient(params: Readonly<{ lang: string }>) {
  const { t } = useTranslation(params.lang, "nav");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const isBigScreen = useBigScreen();
  const cartContext = useCart();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <>
      <Drawer
        title="購物車"
        placement="right"
        width={isBigScreen ? 400 : 220}
        closable={true}
        onClose={() => setOpenCart(false)}
        open={openCart}
        styles={{ body: { padding: "10px" } }}
      >
        <div className="h-5/6 overflow-y-scroll custom-scrollbar border-y">
          {cartContext?.cart.map((item) => (
            <SmallItemCard
              item={item}
              key={item.id}
              className="border-b py-2"
            />
          ))}
        </div>
        <Link
          href={"/checkout"}
          className="block w-full text-center mt-2 rounded bg-green-500 py-1 text-white font-bold"
          onClick={() => setOpenCart(false)}
        >
          前往結帳
        </Link>
      </Drawer>
      <Drawer
        placement="left"
        width={isBigScreen ? 400 : 220}
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{ body: { padding: "10px" } }}
        className="text-xl"
      >
        <div className="h-full flex flex-col justify-between [&>div>a>div]:text-md md:[&>div>a>div]:text-lg [&>div>a]:flex [&>div>a]:p-4 [&>div>a]:items-center [&>div>a]:justify-between [&>div>a]:text-black [&>div>a]:font-bold [&>div>a>span>svg]:text-sm">
          <div>
            <Link href="/">
              <div>{t("home")}</div>
              <PlusOutlined color="black" />
            </Link>
            <hr />
            <Link href="/search">
              <div>{t("search")}</div>
              <PlusOutlined color="black" />
            </Link>
            <hr />
            <Link href="/categories">
              <div>{t("category")}</div>
              <PlusOutlined color="black" />
            </Link>
            <hr />
            <Link href="/point-shop">
              <div>{t("pointShop")}</div>
              <PlusOutlined color="black" />
            </Link>
          </div>
          <div className="">
            <hr />
            <Link href="/about">
              <div>{t("about")}</div>
              <PlusOutlined color="black" />
            </Link>
            <hr />
            <div className="p-2 flex gap-2 text-sm">
              <LanguageSwitcher lang="zh-HK" />
              <LanguageSwitcher lang="en" />
            </div>
          </div>
        </div>
      </Drawer>
      <div
        className={cn(
          "z-50 sticky h-20 w-full gap-8 px-[5%] md:px-[10%] flex items-center justify-between transition-colors bg-transparent",
          pathName === "/"
            ? "absolute hover:bg-white transition-colors duration-500"
            : ""
        )}
      >
        <div className="flex gap-4">
          <Button
            type="text"
            icon={<MenuOutlined color="black" />}
            size={"large"}
            onClick={() => setOpenDrawer(true)}
          />
          <Button
            type="text"
            icon={<SearchOutlined color="black" />}
            size={"large"}
            onClick={() => router.push("/search")}
          />
        </div>

        <MyImage
          src="images/icon.jpg"
          className="cursor-pointer"
          height={48}
          width={48}
          alt="logo"
          onClick={() => router.push("/")}
          externalUrl={true}
        />

        <div className="flex gap-4">
          <Button
            type="text"
            icon={<UserOutlined />}
            size={"large"}
            onClick={() => router.push("/account")}
          />
          <Badge size="small" offset={[2,4]} count={cartContext.cart.length}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              size={"large"}
              onClick={() => setOpenCart(true)}
            />
          </Badge>
        </div>
      </div>
    </>
  );
}

export default NavBarClient;
