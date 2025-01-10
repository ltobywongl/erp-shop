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
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/images/logo-gradient.png";

function NavBarClient(props: Readonly<{ session: Session | null }>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const isBigScreen = useBigScreen();
  const cartContext = useCart();
  const router = useRouter();

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
        className="[&>div>a]:flex [&>div>a]:p-4 [&>div>a]:items-center [&>div>a]:justify-between [&>div>a]:text-black [&>div>a]:font-bold [&>div>a>span>svg]:text-sm text-xl"
      >
        <Link href="/">
          <div>首頁</div>
          <PlusOutlined color="black" />
        </Link>
        <hr />
        <Link href="/search">
          <div>搜索</div>
          <PlusOutlined color="black" />
        </Link>
        <hr />
        <Link href="/categories">
          <div>分類</div>
          <PlusOutlined color="black" />
        </Link>
        <hr />
        <Link href="/account">
          <div>賬號</div>
          <PlusOutlined color="black" />
        </Link>
      </Drawer>
      <div
        className="z-50 sticky h-24 w-full gap-8 px-[5%] md:px-[10%] py-3 flex items-center justify-between transition-colors bg-transparent"
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
            onClick={() => router.push('/search')}
          />
        </div>

        <Image
          src={Logo}
          height={32}
          width={32}
          alt="logo"
          onClick={() => router.push("/")}
        />

        <div className="flex gap-4">
          <Button
            type="text"
            icon={<UserOutlined />}
            size={"large"}
            onClick={() => router.push('/account')}
          />
          <Badge count={cartContext.cart.length}>
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
