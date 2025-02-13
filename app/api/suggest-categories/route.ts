import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { getCategories } from "@/utils/products/categories/categories";
import { fallbackLang, languages } from "@/i18n/settings";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchLang = searchParams.get("lang");
    const lang =
      searchLang && languages.includes(searchLang) ? searchLang : fallbackLang;

    const categories = await getCategories(
      lang,
      {
        updatedAt: "desc",
      },
      4
    );

    return successResponse({
      data: categories,
    });
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
