"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@repo/db/client"

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const fromUser = session?.user?.id;
    if (!fromUser) {
        return {
            message: "User not logged in"
        }
    }
    const toUser = await db.user.findFirst({
        where: {
            number: to
        }
    })
    if (!toUser) {
        return {
            message: "User not found"
        }
    }

    await db.$transaction(async (tx: any) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUser)} FOR UPDATE`;
        const fromBalance = await tx.balance.findUnique({
            where: {
                userId: Number(fromUser)
            },
        })
        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficient Funds");
        }
        await tx.balance.update({
            where: {
                userId: Number(fromUser)
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })
        await tx.balance.update({
            where: {
                userId: toUser.id
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        })
        await tx.p2pTransfer.create({
            data: {
                fromUserId: Number(fromUser),
                toUserId: toUser.id,
                amount,
                timestamp: new Date(),
            },
        });
    })
}