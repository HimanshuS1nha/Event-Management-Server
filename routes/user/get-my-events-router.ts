import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../libs/db";

const getMyEventsRouter = Router();

getMyEventsRouter.post("/", async (req, res) => {
  try {
    const { token } = req.body;

    const email = jwt.verify(token, process.env.JWT_SECRET!) as string;

    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const usersAndEvents = await prisma.usersAndEvents.findMany({
      where: {
        userId: user.id,
      },
    });

    let myEvents = [];

    for (let i = 0; i < usersAndEvents.length; i++) {
      const event = await prisma.events.findUnique({
        where: {
          id: usersAndEvents[i].eventId,
        },
        include: {
          HeadsAndEvents: true,
        },
      });
      myEvents.push(event);
    }

    return res.status(200).json({ myEvents });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getMyEventsRouter };
