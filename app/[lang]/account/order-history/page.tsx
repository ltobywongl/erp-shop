import OrderHistoryOrder from "@/components/order/orderHistory";
import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
import { translation } from "@/i18n";
import { getOrdersByUserId } from "@/utils/orders/orders";
import { loadSessionUser } from "@/utils/user";
import { HomeIcon } from "lucide-react";
import { redirect } from "next/navigation";

async function Page(props: Readonly<{ params: Promise<{ lang: string }> }>) {
  const user = await loadSessionUser();
  if (!user) {
    return redirect("/login");
  }
  const params = await props.params;
  const { t } = await translation(params.lang, "orderHistory");

  const orders = await getOrdersByUserId(params.lang, user.id);

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      href: "/account",
      title: t("account"),
    },
    {
      title: t("orderHistory"),
    },
  ];

  return (
    <div className="flex justify-center py-2 px-2">
      <div className="w-full flex flex-col gap-4">
        <Breadcrumbs items={breadItems} />
        <div>
          {!orders || (orders.length == 0 && <div>{t("noOrderHistory")}</div>)}
          {orders?.map((order) => {
            return (
              <OrderHistoryOrder
                key={order.id}
                order={order}
                lang={params.lang}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
