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
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MenuIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserRoundIcon,
} from "lucide-react";
import { TFunction } from "i18next";
import { LinkButton } from "../ui/link-button";

type CartContext = {
  cart: Item[];
  setcart: (cart: Item[]) => void;
  addQuantity: (item: Item) => void;
  reduceQuantity: (item: Item) => void;
};

function NavBarClient(params: Readonly<{ lang: string }>) {
  const { t } = useTranslation(params.lang, "nav");
  const cartContext = useCart();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div
      className={cn(
        "z-50 sticky h-20 w-full gap-2 md:gap-6 px-[3%] md:px-[8%] flex items-center justify-between transition-colors bg-transparent",
        pathName === "/"
          ? "absolute hover:bg-white transition-colors duration-500"
          : ""
      )}
    >
      <div className="flex gap-2 md:gap-4">
        <NavSheet t={t} />
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

      <div className="flex gap-2 md:gap-4">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => router.push("/account")}
        >
          <UserRoundIcon color="black" />
        </Button>
        <ShoppingCart t={t} cartContext={cartContext} />
      </div>
    </div>
  );
}

function ShoppingCart({
  t,
  cartContext,
}: Readonly<{ t: TFunction<string, undefined>; cartContext: CartContext }>) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="relative">
          <ShoppingCartIcon color="black" />
          <Badge size={"sm"} className="animate-pulse duration-1000" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{t("cart")}</SheetTitle>
        </SheetHeader>
        <div className="h-5/6 overflow-y-scroll custom-scrollbar border-y">
          {cartContext?.cart.map((item) => (
            <SmallItemCard
              item={item}
              key={item.id}
              className="border-b py-2"
            />
          ))}
        </div>
        <SheetFooter>
          <LinkButton
            href={"/checkout"}
            className="w-full mt-2 font-bold"
            onClick={() => setSheetOpen(false)}
          >
            {t("checkout")}
          </LinkButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NavSheet({ t }: Readonly<{ t: TFunction<string, undefined> }>) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MenuIcon color="black" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>
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
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between [&>div>a>div]:text-md md:[&>div>a>div]:text-lg [&>div>a]:flex [&>div>a]:p-4 [&>div>a]:items-center [&>div>a]:justify-between [&>div>a]:text-black [&>div>a]:font-bold [&>div>a>span>svg]:text-sm">
          <div>
            <Link href="/search" onClick={() => setSheetOpen(false)}>
              <div>{t("search")}</div>
              <PlusIcon color="black" />
            </Link>
            <hr />
            <Link href="/categories" onClick={() => setSheetOpen(false)}>
              <div>{t("category")}</div>
              <PlusIcon color="black" />
            </Link>
            <hr />
            <Link href="/point-shop" onClick={() => setSheetOpen(false)}>
              <div>{t("pointShop")}</div>
              <PlusIcon color="black" />
            </Link>
            <hr />
            <Link href="/about" onClick={() => setSheetOpen(false)}>
              <div>{t("about")}</div>
              <PlusIcon color="black" />
            </Link>
          </div>
        </div>
        <SheetFooter>
          <div className="p-2 flex gap-2 text-sm">
            <LanguageSwitcher className="text-black" lang="zh" />
            <LanguageSwitcher className="text-black" lang="en" />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default NavBarClient;
