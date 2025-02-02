import prisma from "@/utils/prisma";
import { loadSessionUser } from "@/utils/user";
import { redirect } from "next/navigation";

async function Page() {
  const user = await loadSessionUser();
  if (!user) {
    return redirect("/login");
  }

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      totalPrice: true,
      receiverName: true,
      receiverAddress: true,
      state: true,
      createdAt: true,
      orderItem: {
        select: {
          product: {
            select: {
              name: true,
            },
          },
          quantity: true,
        },
      },
    },
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="flex justify-center p-2">
      <div className="w-full md:w-4/5 flex flex-col gap-5">
        {orders.map((order) => {
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
                {order.orderItem.map((item) => {
                  return (
                    <div key={item.product.name}>
                      {item.quantity}件 {item.product.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
