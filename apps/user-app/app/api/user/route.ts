import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session.user) {
    return NextResponse.json({
      user: session.user,
    });
  } else {
    return NextResponse.json(
      {
        msg: "you are not logged in",
      },
      {
        status: 403,
      }
    );
  }
}
