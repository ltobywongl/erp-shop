import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/httpResponse";

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
    });

    return successResponse({
      data: categories,
    });
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
