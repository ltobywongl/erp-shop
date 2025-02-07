"use client";
import { useState } from "react";
import Link from "next/link";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import LanguageSwitcher from "@/components/common/langSwitcher";
import { useTranslation } from "@/i18n/client";
import MyImage from "@/components/image/customImage";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MenuIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserRoundIcon,
} from "lucide-react";

function NavBarClient(params: Readonly<{ lang: string }>) {
  const { t } = useTranslation(params.lang, "nav");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const cartContext = useCart();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <>
      <Drawer
        direction="bottom"
        onClose={() => setOpenCart(false)}
        open={openCart}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>購物車</DrawerTitle>
          </DrawerHeader>
          <div className="h-5/6 overflow-y-scroll custom-scrollbar border-y">
            {cartContext?.cart.map((item) => (
              <SmallItemCard
                item={item}
                key={item.id}
                className="border-b py-2"
              />
            ))}
          </div>
          <DrawerFooter>
            <Link
              href={"/checkout"}
              className="block w-full text-center mt-2 rounded bg-green-500 py-1 text-white font-bold"
              onClick={() => setOpenCart(false)}
            >
              前往結帳
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer
        direction="bottom"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Link href="/">
                <MyImage
                  src="images/icon.jpg"
                  className="cursor-pointer"
                  height={48}
                  width={48}
                  alt="logo"
                  onClick={() => router.push("/")}
                  externalUrl={true}
                />
              </Link>
            </DrawerTitle>
          </DrawerHeader>
          <div className="h-full flex flex-col justify-between [&>div>a>div]:text-md md:[&>div>a>div]:text-lg [&>div>a]:flex [&>div>a]:p-4 [&>div>a]:items-center [&>div>a]:justify-between [&>div>a]:text-black [&>div>a]:font-bold [&>div>a>span>svg]:text-sm">
            <div>
              <Link href="/search">
                <div>{t("search")}</div>
                <PlusIcon color="black" />
              </Link>
              <hr />
              <Link href="/categories">
                <div>{t("category")}</div>
                <PlusIcon color="black" />
              </Link>
              <hr />
              <Link href="/point-shop">
                <div>{t("pointShop")}</div>
                <PlusIcon color="black" />
              </Link>
              <hr />
              <Link href="/about">
                <div>{t("about")}</div>
                <PlusIcon color="black" />
              </Link>
            </div>
          </div>
          <DrawerFooter>
            <div className="p-2 flex gap-2 text-sm">
              <LanguageSwitcher className="text-black" lang="zh-HK" />
              <LanguageSwitcher className="text-black" lang="en" />
            </div>
          </DrawerFooter>
        </DrawerContent>
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
            variant={"ghost"}
            size={"icon"}
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon color="black" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => router.push("/search")}
          >
            <SearchIcon color="black" />
          </Button>
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
            variant={"ghost"}
            size={"icon"}
            onClick={() => router.push("/account")}
          >
            <UserRoundIcon color="black" />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setOpenCart(true)}
            className="relative"
          >
            <ShoppingCartIcon color="black" />
            <Badge size={"sm"} className="animate-pulse duration-1000" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default NavBarClient;
