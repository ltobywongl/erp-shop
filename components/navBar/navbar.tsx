"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SmallItemCard } from "@/components/common/itemCard";
import { useCart } from "@/utils/cartProvider";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import LanguageSwitcher from "@/components/common/langSwitcher";
import { useTranslation } from "@/i18n/client";
import MyImage from "@/components/image/customImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TFunction } from "i18next";
import { LinkButton } from "../ui/link-button";
import {
  MenuIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserRoundIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const isHomePage = pathName.split("/").length == 2;

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = document.body.scrollTop || document.documentElement.scrollTop;
    setScrollPosition(position);
  };

  useEffect(() => {
    document.body.addEventListener('scroll', handleScroll);
    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "z-50 w-full p-0.5 gap-2 md:gap-6 px-[3%] md:px-[8%] flex items-center justify-between transition-colors duration-500 bg-transparent py-4",
        isHomePage
          ? scrollPosition == 0 ? "fixed hover:bg-white group" : "fixed bg-white [&>div>button>svg]:text-black border-b"
          : "sticky bg-white border-b"
      )}
    >
      <div className="flex gap-2 md:gap-4">
        <NavSheet t={t} isHomePage={isHomePage} />
        <Button
          variant={isHomePage ? "semiGhost" : "ghost"}
          size={"icon"}
          onClick={() => router.push("/search")}
        >
          <SearchIcon className={isHomePage ? "text-white group-hover:text-black transition-colors" : ""} />
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
          variant={isHomePage ? "semiGhost" : "ghost"}
          size={"icon"}
          onClick={() => router.push("/account")}
        >
          <UserRoundIcon className={isHomePage ? "text-white group-hover:text-black transition-colors" : ""} />
        </Button>
        <ShoppingCart t={t} cartContext={cartContext} isHomePage={isHomePage} />
      </div>
    </div>
  );
}

function ShoppingCart({
  t,
  cartContext,
  isHomePage,
}: Readonly<{
  t: TFunction<string, undefined>;
  cartContext: CartContext;
  isHomePage: boolean;
}>) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={isHomePage ? "semiGhost" : "ghost"}
          size={"icon"}
          className="relative"
        >
          <ShoppingCartIcon className={isHomePage ? "text-white group-hover:text-black transition-colors" : ""} />
          {cartContext.cart.length > 0 && (
            <Badge size={"sm"} className="animate-pulse duration-1000" />
          )}
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

          >
            {t("checkout")}
          </LinkButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NavSheet({
  t,
  isHomePage,
}: Readonly<{ t: TFunction<string, undefined>; isHomePage: boolean }>) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant={isHomePage ? "semiGhost" : "ghost"} size={"icon"}>
          <MenuIcon className={isHomePage ? "text-white group-hover:text-black transition-colors" : ""} />
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
            <Link href="/search">
              <div>{t("search")}</div>
              <PlusIcon />
            </Link>
            <hr />
            <Link href="/categories">
              <div>{t("category")}</div>
              <PlusIcon />
            </Link>
            <hr />
            <Link href="/point-shop">
              <div>{t("pointShop")}</div>
              <PlusIcon />
            </Link>
            <hr />
            <Link href="/about">
              <div>{t("about")}</div>
              <PlusIcon />
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
