import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import { createId } from '@paralleldrive/cuid2';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.role) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    if (!body.id || typeof body.id !== "string")
      return errorResponse("Missing Params", 400);

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    const couponCategory = await prisma.couponCategory.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!user || !couponCategory) return errorResponse("Bad Request", 400);

    if (couponCategory.useStock && couponCategory.stock < 1) {
      return errorResponse("Out of stock", 400);
    }

    if (user.couponPoints < couponCategory.point) {
      return errorResponse("Not enough points", 400);
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          couponPoints: {
            decrement: couponCategory.point,
          },
        },
      }),
      prisma.coupon.create({
        data: {
          id: createId(),
          userId: session.user.id,
          couponCategoryId: couponCategory.id,
        },
      }),
      ...(couponCategory.useStock
        ? [
            prisma.couponCategory.update({
              where: {
                id: couponCategory.id,
              },
              data: {
                stock: {
                  decrement: 1,
                },
              },
            }),
          ]
        : []),
    ]);

    return successResponse("Success", "Success");
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
