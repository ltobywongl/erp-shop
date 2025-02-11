import prisma from "@/utils/prisma";

export async function getOrdersByUserId(lang: string, userId: string) {
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
              id: true,
              name: true,
            },
          },
          quantity: true,
        },
      },
    },
    where: {
      userId: userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!orders) return null;

  return orders.map((order) => {
    const orderProducts = order.orderItem.map((item) => {
      return {
        id: item.product.id,
        name: (item.product.name as Record<string, string>)[lang],
        quantity: item.quantity,
      };
    });

    return {
      id: order.id,
      totalPrice: order.totalPrice,
      receiverName: order.receiverName,
      receiverAddress: order.receiverAddress,
      state: order.state,
      createdAt: order.createdAt,
      products: orderProducts,
    } as Order;
  });
}
