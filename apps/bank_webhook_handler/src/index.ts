import express from "express";
import db from "@repo/db/client";
const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };

  try {
    console.log("hello1");
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount) * 100,
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.json({
      message: "On Ramp Tansaction successfull",
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "On Ramp Txn failed inside webhook",
    });
  }
});

app.listen(3003);
