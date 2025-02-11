import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { getProducts } from "@/utils/products/products";
import { fallbackLang } from "@/i18n/settings";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;
  const lang = searchParams.get("lang") ?? fallbackLang;
  const id = searchParams.get("id");
  if (!id) return errorResponse("Missing Params", 400);

  const whereClause = {
    deletedAt: null,
    category: {
      id,
      suspend: false,
      deletedAt: null,
    },
    OR: [
      {
        useStock: false,
      },
      {
        stock: { gt: 0 },
      },
    ],
  };

  const orderByClause: {
    createdAt: "asc" | "desc";
  } = {
    createdAt: "desc",
  };

  const products = await getProducts(
    lang,
    orderByClause,
    pageSize,
    (page - 1) * pageSize,
    whereClause
  );

  const totalItems = await prisma.product.count({
    where: whereClause,
  });

  return successResponse({
    data: products,
    totalPages: Math.ceil(totalItems / pageSize),
    totalItems: totalItems,
  });
}
