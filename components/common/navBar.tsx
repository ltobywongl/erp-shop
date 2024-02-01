"use client";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  FormOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Input, Button, Badge, Drawer } from "antd";
import { useState } from "react";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";

const { Search } = Input;

function NavBar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer
        placement="left"
        width="100"
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{ body: { padding: "10px" } }}
      >
        <div>
          <Button
            type="text"
            icon={<UserOutlined style={{ color: "black" }} />}
            size={"large"}
          />
          <div>登入</div>
        </div>

        <Button
          type="text"
          icon={<SearchOutlined style={{ color: "black" }} />}
          size={"large"}
        />
      </Drawer>
      <div className="h-[56px] md:h-24 w-full gap-8 px-4 py-3 flex items-center justify-between md:justify-around bg-zinc-100 md:bg-transparent">
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
        <Search
          placeholder="Search"
          enterButton
          size="large"
          loading={false}
          className="max-w-[40%] !hidden md:!block"
        />
        <div className="flex gap-4">
          <Button
            type="text"
            icon={<SearchOutlined style={{ color: "black" }} />}
            size={"large"}
            className="md:!hidden"
          />
          <Badge count={1}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              size={"large"}
              className="md:!bg-green-500 md:hover:!bg-green-600 md:active:!bg-green-600 md:!text-white"
            />
          </Badge>
        </div>
      </div>
      <div className="h-[3rem] w-full mt-4 bg-zinc-700 gap-4 px-4 hidden md:flex items-center justify-around">
        <div className="flex h-full [&>a]:flex [&>a]:h-full [&>a]:items-center [&>a]:px-6">
          <Link href="/" className="bg-red-500 text-white">
            首頁
          </Link>
          <Link href="/" className="text-zinc-200">
            新品預訂
          </Link>
          <Link href="/" className="text-zinc-200">
            電競裝備
          </Link>
        </div>
        <div className="flex h-full [&>a]:flex [&>a]:h-full [&>a]:items-center [&>a]:px-6">
          <a href="/" className="text-zinc-200">
            <UserOutlined className="mr-1" />
            登入
          </a>
          <a href="/" className="text-zinc-200">
            <FormOutlined className="mr-1" />
            註冊
          </a>
        </div>
      </div>
    </>
  );
}

export default NavBar;
