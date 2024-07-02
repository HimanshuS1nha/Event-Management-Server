import { Router } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

import prisma from "../../libs/db";
import { editEventDetailsValidator } from "../../validators/head/edit-event-details-validator";

const editEventDetailsRouter = Router();

editEventDetailsRouter.post("/", async (req, res) => {
  try {
    const { roomNo, name, location, token, eventId } =
      await editEventDetailsValidator.parseAsync(req.body);

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
      return res.status(404).json({ error: "Event not found" });
    }

    const headAndEvent = await prisma.headsAndEvents.findUnique({
      where: {
        eventId: event.id,
        headId: head.id,
      },
    });
    if (!headAndEvent) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newEvent = await prisma.events.update({
      where: {
        id: event.id,
      },
      data: {
        name,
        location,
        roomNo,
      },
    });

    return res.status(201).json({ myEvent: newEvent });
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

export { editEventDetailsRouter };
