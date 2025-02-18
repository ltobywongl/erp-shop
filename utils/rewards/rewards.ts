import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export async function getRewardById(
  lang: string,
  orderBy?: Prisma.CouponCategoryOrderByWithRelationInput,
  take?: number,
  skip?: number,
  where?: Prisma.CouponCategoryWhereInput
) {
  const couponCategory = await prisma.couponCategory.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
      imagePath: true,
      useStock: true,
      stock: true,
      point: true,
      value: true,
      minCheckValue: true,
    },
    where: where ?? {
      OR: [
        {
          useStock: false,
        },
        {
          stock: { gt: 0 },
        },
      ],
      deletedAt: null,
      active: true,
    },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });

  if (!couponCategory) return null;

  const categoryName = (couponCategory.name as Record<string, string>)[lang];
  const categoryDescription = (
    couponCategory.description as Record<string, string>
  )[lang];

  return {
    id: couponCategory.id,
    name: categoryName,
    description: categoryDescription,
    imagePath: couponCategory.imagePath,
    useStock: couponCategory.useStock,
    stock: couponCategory.stock,
    point: couponCategory.point,
    value: couponCategory.value,
    minCheckValue: couponCategory.minCheckValue,
  } as CouponCategory;
}

export async function getRewards(
  lang: string,
  orderBy?: Prisma.CouponCategoryOrderByWithRelationInput,
  take?: number,
  skip?: number,
  where?: Prisma.CouponCategoryWhereInput
) {
  const couponCategories = await prisma.couponCategory.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imagePath: true,
      useStock: true,
      stock: true,
      point: true,
      value: true,
      minCheckValue: true,
    },
    where: where ?? {
      OR: [
        {
          useStock: false,
        },
        {
          stock: { gt: 0 },
        },
      ],
      deletedAt: null,
      active: true,
    },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });

  return couponCategories.map((category) => {
    const categoryName = (category.name as Record<string, string>)[lang];
    const categoryDescription = (
      category.description as Record<string, string>
    )[lang];

    return {
      id: category.id,
      name: categoryName,
      description: categoryDescription,
      imagePath: category.imagePath,
      useStock: category.useStock,
      stock: category.stock,
      point: category.point,
      value: category.value,
      minCheckValue: category.minCheckValue,
    } as CouponCategory;
  });
}

export async function getRewardsByUserId(lang: string, userId: string) {
  const coupons = await prisma.coupon.findMany({
    select: {
      id: true,
      couponCategory: {
        select: {
          name: true,
          value: true,
          imagePath: true,
          minCheckValue: true,
        },
      },
    },
    where: {
      userId: userId,
      usedAt: null,
      couponCategory: {
        deletedAt: null,
        active: true,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return coupons.map((coupon) => {
    const couponName = (coupon.couponCategory.name as Record<string, string>)[
      lang
    ];

    return {
      id: coupon.id,
      name: couponName,
      value: coupon.couponCategory.value,
      imagePath: coupon.couponCategory.imagePath,
      minCheckValue: coupon.couponCategory.minCheckValue,
    } as Coupon;
  });
}
