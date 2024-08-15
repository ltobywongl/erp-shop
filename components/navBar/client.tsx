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
import { Input, Button, Badge, Drawer } from "antd";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import useBigScreen from "@/utils/hooks/windowSize";
import { useRouter, useSearchParams } from "next/navigation";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const { Search } = Input;

function SearchBar(params: { className?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Search
      placeholder="Search"
      defaultValue={searchParams.get("keyword") ?? ""}
      enterButton
      size="large"
      loading={false}
      onSearch={(data) => {
        if (data.length > 0) router.push(`/search/${data}`);
      }}
      className={params.className}
    />
  );
}

function NavBarClient(props: { session: Session | null }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const isBigScreen = useBigScreen();
  const cartContext = useCart();
  const router = useRouter();
  const timeStamp = new Date().getTime();

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
        <Link href="/booking" className="text-zinc-200">
          <InfoCircleOutlined color="black" />
          <div>預約系統</div>
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
      <div className="z-0 h-[56px] md:h-24 w-full gap-8 px-4 py-3 flex items-center justify-between md:justify-around bg-zinc-100 md:bg-transparent">
        <div className="h-full flex gap-4">
          <Button
            type="text"
            icon={<MenuOutlined color="black" />}
            size={"large"}
            onClick={() => setOpenDrawer(true)}
            className="md:!hidden"
          />
          <Link href="/">
            <Image
              src={`https://publicen.s3.ap-southeast-2.amazonaws.com/images/icon.jpg?timeStamp=${timeStamp}`}
              alt="Shop"
              className="h-full w-auto max-h-16 object-contain"
              width={200}
              height={200}
            />
          </Link>
        </div>
        <Suspense
          fallback={
            <Search
              placeholder="Search"
              enterButton
              size="large"
              loading={false}
              onSearch={(data) => {
                if (data.length > 0) router.push(`/search/${data}`);
              }}
              className="max-w-[40%] !hidden md:!block"
            />
          }
        >
          <SearchBar className="max-w-[40%] !hidden md:!block" />
        </Suspense>

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
      <div className="md:!hidden" hidden={!openSearch}>
        <Suspense
          fallback={
            <Search
              placeholder="Search"
              enterButton
              size="large"
              loading={false}
              onSearch={(data) => {
                if (data.length > 0) router.push(`/search?keyword=${data}`);
              }}
            />
          }
        >
          <SearchBar />
        </Suspense>
      </div>
      <div className="h-[3rem] w-full mt-4 bg-zinc-700 gap-4 px-4 hidden md:flex items-center justify-around">
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
          <Link href="/booking" className="text-zinc-200">
            預約系統
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
