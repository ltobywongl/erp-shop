import { authOptions } from "@/utils/authOptions";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const rawFormData = await request.formData();
    const formData = {
      name: rawFormData.get("name"),
      amount: rawFormData.get("amount"),
      transfer: rawFormData.get("transfer"),
    };

    if (!formData.name || !formData.amount || !formData.transfer) {
      return errorResponse("缺少資料", 400);
    }

    const file = formData.transfer as File;

    const fileUUID = uuid();
    const path = `orders/payments/${user.id}/${fileUUID}`;

    await uploadBlob("erp-shop-private", path, file, file.type);

    await prisma.topup.create({
      data: {
        id: uuid(),
        userId: user.id,
        amount: parseFloat(formData.amount.toString()),
        imagePath: path,
      },
    });

    return successResponse("Success", "Success", 200);
  } catch (e: any) {
    console.log(e);
    return errorResponse("Internal Server Error", 500);
  }
}
