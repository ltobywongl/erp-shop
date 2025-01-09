import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { errorResponse } from "@/utils/httpResponse";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;
  const keyword = searchParams.get("keyword");
  if (!keyword) return errorResponse("Missing Params", 400);

  const whereClause = {
    deletedAt: null,
    name: {
      contains: keyword,
    },
    OR: [
      {
        useStock: false,
      },
      {
        stock: { gt: 0 },
      }
    ],
  };

  const orderByClause: {
    createdAt: "asc" | "desc";
  } = {
    createdAt: "desc",
  };

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      discount: true,
      couponPoint: true,
      useStock: true,
      stock: true,
      category: {
        select: {
          discount: true,
        },
      },
    },
    where: whereClause,
    orderBy: orderByClause,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const totalItems = await prisma.product.count({
    where: whereClause,
  });

  return NextResponse.json({
    data: products,
    totalPages: Math.ceil(totalItems / pageSize),
    totalItems: totalItems,
  });
}
