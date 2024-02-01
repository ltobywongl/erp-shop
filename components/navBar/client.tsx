"use client";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  FormOutlined,
  MenuOutlined,
  StarOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Input, Button, Badge, Drawer } from "antd";
import { Suspense, useState } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/providers/CartProvider";
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
        if (data.length > 0) router.push(`/search?keyword=${data}`);
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

  return (
    <>
      <Drawer
        title="購物車"
        placement="right"
        width={isBigScreen ? "400" : "200"}
        closable={true}
        onClose={() => setOpenCart(false)}
        open={openCart}
        styles={{ body: { padding: "10px" } }}
      >
        {cartContext?.cart.map((item) => (
          <SmallItemCard item={item} key={item.id} />
        ))}
      </Drawer>
      <Drawer
        placement="left"
        width="80"
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{ body: { padding: "10px" } }}
        className="[&>div>a]:flex [&>div>a]:flex-col [&>div>a]:items-center [&>div>a]:justify-center [&>div>a]:text-black [&>div>a]:aspect-square"
      >
        <Link href="/login">
          <UserOutlined style={{ color: "black" }} />
          <div>登入</div>
        </Link>
        <Link href="/search">
          <SearchOutlined style={{ color: "black" }} />
          <div>搜索</div>
        </Link>
        <Link href="/">
          <StarOutlined style={{ color: "black" }} />
          <div>首頁</div>
        </Link>
        <Link href="/setting">
          <SettingOutlined style={{ color: "black" }} />
          <div>設置</div>
        </Link>
      </Drawer>
      <div className="z-0 h-[56px] md:h-24 w-full gap-8 px-4 py-3 flex items-center justify-between md:justify-around bg-zinc-100 md:bg-transparent">
        <div className="h-full flex gap-4">
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "black" }} />}
            size={"large"}
            onClick={() => setOpenDrawer(true)}
            className="md:!hidden"
          />
          <Link href="/">
            <Image src={logo} alt="ERP Shop" className="h-full w-auto" />
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
                if (data.length > 0) router.push(`/search?keyword=${data}`);
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
            icon={<SearchOutlined style={{ color: "black" }} />}
            size={"large"}
            className="md:!hidden"
            onClick={() => setOpenSearch(!openSearch)}
          />
          <Badge count={1}>
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
          <Link href="/category/0" className="text-zinc-200">
            新品預訂
          </Link>
          <Link href="/category/4" className="text-zinc-200">
            電競裝備
          </Link>
        </div>
        <div className="flex h-full [&>a]:flex [&>a]:h-full [&>a]:items-center [&>a]:px-6">
          {props.session ? (
            <>
              <div className="text-zinc-200 flex h-full items-center px-6">
                <UserOutlined className="mr-1" />
                {props.session.user?.name}
              </div>
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
