import { NextResponse } from "next/server";

export const errorResponse = (error: string, statusCode: number) => {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    {
      status: statusCode,
    }
  );
};

export const successResponse = (
  message: string,
  body: any,
  statusCode?: number
) => {
  return NextResponse.json(
    {
      success: true,
      body,
      message,
    },
    {
      status: statusCode,
    }
  );
};
