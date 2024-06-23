import { Router } from "express";

import prisma from "../libs/db";

const getHeadDetailsRouter = Router();

getHeadDetailsRouter.post("/", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(422).json({ error: "Invalid request" });
    }

    const head = await prisma.heads.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        image: true,
        phoneNumber: true,
      },
    });

    return res.status(200).json({ head });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getHeadDetailsRouter };
