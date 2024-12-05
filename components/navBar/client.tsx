"use client";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  FormOutlined,
  MenuOutlined,
  StarOutlined,
  SettingOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Badge, Drawer } from "antd";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import useBigScreen from "@/utils/hooks/windowSize";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import SearchBar from "../common/searchBar";

function NavBarClient(props: Readonly<{ session: Session | null }>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const isBigScreen = useBigScreen();
  const cartContext = useCart();
  
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
        width={80}
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{ body: { padding: "10px" } }}
        className="[&>div>a]:flex [&>div>a]:flex-col [&>div>a]:items-center [&>div>a]:justify-center [&>div>a]:text-black [&>div>a]:aspect-square"
      >
        {props.session ? (
          <>
            <div className="flex flex-col items-center justify-center aspect-square">
              <UserOutlined color="black" />
              <button onClick={() => signOut()}>登出</button>
            </div>
          </>
        ) : (
          <Link href="/login">
            <UserOutlined color="black" />
            <div>登入</div>
          </Link>
        )}
        <Link href="/">
          <StarOutlined color="black" />
          <div>首頁</div>
        </Link>
        <Link href="/search">
          <SearchOutlined color="black" />
          <div>搜索</div>
        </Link>
        <Link href="/categories" className="text-zinc-200">
          <AppstoreOutlined color="black" />
          <div>商品種類</div>
        </Link>
        <Link href="/settings">
          <SettingOutlined color="black" />
          <div>設置</div>
        </Link>
        <Link href="/about" className="text-zinc-200">
          <InfoCircleOutlined color="black" />
          <div>關於我們</div>
        </Link>
      </Drawer>
      <div className="z-50 h-[56px] md:h-24 w-full gap-8 px-4 py-3 flex items-center justify-between md:justify-around bg-zinc-100 md:bg-transparent">
        <div className="h-full flex gap-4">
          <Button
            type="text"
            icon={<MenuOutlined color="black" />}
            size={"large"}
            onClick={() => setOpenDrawer(true)}
            className="md:!hidden"
          />
          <Image
            src={`${process.env.AWS_S3_URL ?? ""}/images/icon.jpg`}
            alt="Shop"
            className="h-full w-auto max-h-16 object-contain"
            width={200}
            height={200}
          />
        </div>
        <SearchBar className="!w-2/5 !hidden md:!flex" />

        <div className="flex gap-4">
          <Button
            type="text"
            icon={<SearchOutlined color="black" />}
            size={"large"}
            className="md:!hidden"
            onClick={() => setOpenSearch(!openSearch)}
          />
          <Badge count={cartContext.cart.length}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              size={"large"}
              className="md:!bg-green-500 md:hover:!bg-green-600 md:active:!bg-green-600 md:!text-white"
              onClick={() => setOpenCart(true)}
            />
          </Badge>
        </div>
      </div>
      <div className="z-50 md:!hidden" hidden={!openSearch}>
        <SearchBar />
      </div>
      <div className="z-50 h-[3rem] w-full mt-4 bg-zinc-700 gap-4 px-4 hidden md:flex items-center justify-around">
        <div className="flex h-full [&>a]:flex [&>a]:h-full [&>a]:items-center [&>a]:px-6">
          <Link href="/" className="bg-red-500 text-white">
            首頁
          </Link>
          <Link href="/point-shop" className="text-zinc-200">
            積分商城
          </Link>
          <Link href="/categories" className="text-zinc-200">
            商品種類
          </Link>
          <Link href="/about" className="text-zinc-200">
            關於我們
          </Link>
        </div>
        <div className="flex h-full [&>a]:flex [&>a]:h-full [&>a]:items-center [&>a]:px-6">
          {props.session ? (
            <>
              <Link
                href={"/settings"}
                className="text-zinc-200 flex h-full items-center px-6"
              >
                <UserOutlined className="mr-1" />
                {props.session.user?.name}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-zinc-200 flex h-full items-center px-6"
              >
                <FormOutlined className="mr-1" />
                登出
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-zinc-200">
                <UserOutlined className="mr-1" />
                登入
              </a>
              <a href="/register" className="text-zinc-200">
                <FormOutlined className="mr-1" />
                註冊
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBarClient;
