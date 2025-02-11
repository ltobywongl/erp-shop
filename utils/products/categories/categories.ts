import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export async function getCategories(
  lang: string,
  orderBy?: Prisma.CategoryOrderByWithRelationInput,
  take?: number,
  skip?: number,
  where?: Prisma.CategoryWhereInput,
) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      discount: true,
    },
    where: where ?? {
      deletedAt: null,
      suspend: false,
    },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });

  if (!categories) return null;

  return categories.map((category) => {
    const categoryName = (category.name as Record<string, string>)[lang];

    return {
      id: category.id,
      name: categoryName,
      discount: category.discount,
    } as Category;
  });
}
