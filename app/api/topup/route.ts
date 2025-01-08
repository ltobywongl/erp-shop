import { errorResponse, successResponse } from "@/utils/httpResponse";
import prisma from "@/utils/prisma";
import { uploadBlob } from "@/utils/s3";
import { NextRequest } from "next/server";
import { createId } from '@paralleldrive/cuid2';
import { loadUser } from "@/utils/user";

export async function POST(request: NextRequest) {
  try {
    const user = await loadUser();

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

    const fileUUID = createId();
    const path = `orders/payments/${user.id}/${fileUUID}`;

    await uploadBlob("tomshop-pub", path, file, file.type);

    await prisma.topup.create({
      data: {
        id: createId(),
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
