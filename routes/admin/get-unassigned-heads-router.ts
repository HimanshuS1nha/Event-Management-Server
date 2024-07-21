import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";

const getUnassignedHeadsRouter = Router();

getUnassignedHeadsRouter.post("/", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const email = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const heads = await prisma.heads.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        phoneNumber: true,
        HeadsAndEvents: true,
      },
    });

    let unassignedHeads: {
      id: string;
      name: string;
    }[] = [];

    for await (const head of heads) {
      if (head.HeadsAndEvents.length === 0) {
        unassignedHeads.push({
          id: head.id,
          name: head.name,
        });
      }
    }

    return res.status(200).json({ unassignedHeads });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getUnassignedHeadsRouter };
