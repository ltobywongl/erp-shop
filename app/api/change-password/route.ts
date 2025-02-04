import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import * as bcrypt from "bcrypt";
import { errorResponse, successResponse } from "@/utils/httpResponse";

export async function POST(req: NextRequest) {
  try {
    const body: UserChangePassword = await req.json();

    if (!body.email || !body.password || !body.newPassword)
      return errorResponse("Unauthorized", 401);

    const loginUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        password: true,
        provider: true,
      },
      where: {
        email: body.email,
      },
    });

    if (!loginUser || loginUser.provider != 'credentials' || !loginUser.password) {
      return errorResponse("Unauthorized", 401);
    }

    const passwordCorrect = await bcrypt.compare(
      body.password,
      loginUser.password
    );

    if (passwordCorrect) {
      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      await prisma.user.update({
        where: {
          id: loginUser.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return successResponse("Password Changed");
    } else
      return errorResponse("Unauthorized", 401);
  } catch (error: any) {
    return errorResponse("Internal Server Error", 500);
  }
}

export const dynamic = "force-dynamic";
