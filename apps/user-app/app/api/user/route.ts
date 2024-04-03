import { NextResponse } from "next/server";
import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();

export async function GET() {
  await prisma.user.create({
    data: {
      number: "12334",
      password: "qwerty",
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
}
