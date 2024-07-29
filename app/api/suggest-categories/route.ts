import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/httpResponse";

export async function GET(request: NextRequest) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 4,
  });

  return NextResponse.json({
    data: categories,
  });
}
