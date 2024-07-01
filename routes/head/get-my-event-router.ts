import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";

const getMyEventRouter = Router();

getMyEventRouter.post("/", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const email = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const head = await prisma.heads.findUnique({
      where: {
        email,
      },
    });
    if (!head) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const headAndEvent = await prisma.headsAndEvents.findUnique({
      where: {
        headId: head.id,
      },
    });
    if (!headAndEvent) {
      return res
        .status(404)
        .json({ error: "You have not been assigned any event yet" });
    }

    const myEvent = await prisma.events.findUnique({
      where: {
        id: headAndEvent.eventId,
      },
    });
    if (!myEvent) {
      return res
        .status(404)
        .json({ error: "You have not been assigned any event yet" });
    }

    return res.status(200).json({ myEvent });
  } catch (error) {}
});

export { getMyEventRouter };
