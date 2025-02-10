import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { searchProducts } from "@/utils/products/products";
import { fallbackLang } from "@/i18n/settings";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageSize = 10;
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;
  const keyword = searchParams.get("keyword");
  const lang = searchParams.get("lang") ?? fallbackLang;
  if (!keyword) return errorResponse("Missing Params", 400);

  const products = await searchProducts(
    lang,
    keyword,
    pageSize,
    (page - 1) * pageSize,
  );

  return successResponse({
    data: products.products,
    totalPages: Math.ceil(products.counts / pageSize),
    totalItems: products.counts,
  });
}
