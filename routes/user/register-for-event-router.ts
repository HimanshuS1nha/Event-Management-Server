import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { registerValidator } from "../validators/user/register-for-event-validator";
import prisma from "../libs/db";

const registerForEventRouter = Router();

registerForEventRouter.post("/", async (req, res) => {
  try {
    const { eventId, token } = await registerValidator.parseAsync(req.body);

    const email = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!email) {
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

    const isUserAlreadyRegistered = await prisma.usersAndEvents.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: user.id,
        },
      },
    });

    if (isUserAlreadyRegistered) {
      return res
        .status(409)
        .json({ error: "You have already registered for this event" });
    }

    await prisma.usersAndEvents.create({
      data: {
        eventId,
        userId: user.id,
      },
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({ error: error.errors[0].message });
    } else {
      res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { registerForEventRouter };
