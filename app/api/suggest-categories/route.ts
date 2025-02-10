import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { getCategories } from "@/utils/products/categories/categories";
import { fallbackLang } from "@/i18n/settings";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") ?? fallbackLang;

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
