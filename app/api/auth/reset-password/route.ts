import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/httpResponse";
import * as bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body: UserResetPassword = await req.json();

    if (!body.verificationId || !body.password) {
      return errorResponse("Invalid Parameters", 400);
    }

    const verification = await prisma.verifications.findFirst({
      where: {
        id: body.verificationId,
        type: "forget-password",
      },
    });

    if (!verification || verification.deletedAt != null) {
      return errorResponse("Invalid Parameters", 400);
    }

    if (verification.expiredAt && verification.expiredAt < new Date()) {
      return errorResponse("Expired Action", 400);
    }

    body.password = await bcrypt.hash(body.password, 10);
    await prisma.user.update({
      data: {
        password: body.password,
      },
      where: {
        id: verification.userId,
      },
    });

    return successResponse("Password changed");
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}
