import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      totalPrice: true,
      receiverName: true,
      receiverAddress: true,
      approved: true,
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
      userId: session.user.id,
    },
  });

  return (
    <div className="flex justify-center p-2">
      <div className="w-4/5 flex flex-col gap-5">
        {orders.map((order) => {
          return (
            <div className="p-3 border rounded-lg" key={order.id}>
              <div className="font-bold">
                下單日期 {order.createdAt.toLocaleDateString()}
              </div>
              <div>
                ${order.totalPrice}, 送往 {order.receiverName},{" "}
                {order.receiverAddress}
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
