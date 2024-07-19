import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import * as bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: UserLogin = await req.json();

    if (!body.email || !body.password)
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

    const loginUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
      where: {
        email: body.email,
      },
    });

    if (!loginUser)
      return NextResponse.json(
        { success: false, message: "Wrong Username/Password" },
        { status: 401 }
      );

    const passwordCorrect = await bcrypt.compare(
      body.password,
      loginUser.password
    );

    if (passwordCorrect)
      return NextResponse.json({
        success: true,
        user: {
          id: loginUser.id,
          email: loginUser.email,
          name: loginUser.username,
        },
      });
    else
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
