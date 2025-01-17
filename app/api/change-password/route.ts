import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import * as bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body: UserChangePassword = await req.json();

    if (!body.email || !body.password || !body.newPassword)
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

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

    if (!loginUser)
      return NextResponse.json(
        { success: false, message: "Unknown Account" },
        { status: 401 }
      );

    if (loginUser.provider != 'credentials' || !loginUser.password) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
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
      return NextResponse.json(
        { success: true, message: "Password Changed" },
        { status: 200 }
      );
    } else
      return NextResponse.json(
        { success: false, message: "Wrong Username/Password" },
        { status: 401 }
      );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
