"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export async function createOnRamptxn(provider: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const token = (Math.random() * 1000).toString();
  try {
    await db.onRampTransaction.create({
      data: {
        status: "Processing",
        token: token,
        provider,
        amount: amount * 100,
        startTime: new Date(),
        userId: Number(session?.user?.id),
      },
    });
    return {
      message: "Done",
    };
  } catch (e) {
    console.error(e);
    return {
      message: "creation of onRampTxn failed",
    };
  }
}
