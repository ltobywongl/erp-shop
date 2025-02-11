import { BreadcrumbItemType, Breadcrumbs } from "@/components/ui/breadcrumb";
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

  const orders = await getOrdersByUserId(params.lang, user.id);

  const breadItems: BreadcrumbItemType[] = [
    {
      href: "/",
      title: <HomeIcon />,
    },
    {
      href: "/account",
      title: "帳號",
    },
    {
      title: "訂單記錄",
    },
  ];

  return (
    <div className="flex justify-center p-2">
      <div className="w-full md:w-4/5 flex flex-col gap-4">
        <Breadcrumbs items={breadItems} />
        <div>
          {!orders || (orders.length == 0 && <div>沒有訂單</div>)}
          {orders?.map((order) => {
            return (
              <div className="p-3 border rounded-lg" key={order.id}>
                <div className="font-bold flex justify-between">
                  <div>下單日期 {order.createdAt.toLocaleDateString()}</div>
                  <div>訂單狀態: {order.state}</div>
                </div>
                <div>價格: ${order.totalPrice}</div>
                <div>
                  送往 {order.receiverName}, {order.receiverAddress}
                </div>
                <hr className="my-1" />
                <div>
                  <div className="font-bold">明細</div>
                  {order.products.map((item) => {
                    return (
                      <div key={item.id}>
                        {item.quantity}件 {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
