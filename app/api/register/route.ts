import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: UserRegister = await req.json();

    if (!body.email || !body.name || !body.password || !/\S+@\S+\.\S+/.test(body.email))
      return NextResponse.json({ success: false }, { status: 400 });

    const emailUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (emailUser !== null)
      return NextResponse.json(
        { success: false, message: "An user with this email already exists" },
        { status: 400 }
      );

    body.password = await bcrypt.hash(body.password, 10);
    await prisma.user.create({
      data: body,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
