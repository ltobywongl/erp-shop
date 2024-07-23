import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { errorResponse } from "@/utils/httpResponse";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return errorResponse("Unauthorized", 401);
    }

    const body: {
      venue: string;
      date: string;
      time: string;
    } = await req.json();

    if (!body.venue || !body.date || !body.time)
      return NextResponse.json(
        { success: false, message: "Missing Params" },
        { status: 400 }
      );

    await prisma.booking.create({
      data: {
        id: uuid(),
        userId: session.user.id,
        venue: body.venue,
        date: moment.utc(body.date).toDate(),
        time: moment(body.date + " " + body.time).toDate(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Created" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
