import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { getRegisteredStudentsValidator } from "../../validators/head/get-registered-students-validator";
import { ZodError } from "zod";

const getRegisteredStudentsRouter = Router();

getRegisteredStudentsRouter.post("/", async (req, res) => {
  try {
    const { token, eventId } = await getRegisteredStudentsValidator.parseAsync(
      req.body
    );
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

    const event = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found!" });
    }

    const usersAndEvents = await prisma.usersAndEvents.findMany({
      where: {
        eventId: event.id,
      },
    });

    if (usersAndEvents.length === 0) {
      return res.status(200).json({ students: [] });
    }

    let students: {
      name: string;
      image: string;
      id: string;
      branch: string;
      year: string;
    }[] = [];

    for (const userAndEvent of usersAndEvents) {
      const user = await prisma.users.findUnique({
        where: {
          id: userAndEvent.userId,
        },
        select: {
          id: true,
          name: true,
          branch: true,
          year: true,
          image: true,
        },
      });
      if (user) {
        students.push(user);
      }
    }

    return res.status(200).json({ students });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.errors[0].message });
    } else {
      return res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { getRegisteredStudentsRouter };
