import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";

const getAllHeadsRouter = Router();

getAllHeadsRouter.post("/", async (req, res) => {
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

    let allHeads: {
      id: string;
      name: string;
      eventName: string;
      phoneNumber: string;
      image: string;
    }[] = [];

    for await (const head of heads) {
      if (head.HeadsAndEvents.length !== 0) {
        const event = await prisma.events.findUnique({
          where: {
            id: head.HeadsAndEvents[0].eventId,
          },
        });

        allHeads.push({
          eventName: event!.name,
          id: head.id,
          image: head.image,
          name: head.name,
          phoneNumber: head.phoneNumber,
        });
      } else {
        allHeads.push({
          eventName: "No Event",
          id: head.id,
          image: head.image,
          name: head.name,
          phoneNumber: head.phoneNumber,
        });
      }
    }

    return res.status(200).json({ allHeads });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getAllHeadsRouter };
