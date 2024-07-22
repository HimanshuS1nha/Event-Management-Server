import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { editEventValidator } from "../../validators/admin/edit-event-validator";

const editEventRouter = Router();

editEventRouter.post("/", async (req, res) => {
  try {
    const {
      id,
      category,
      date,
      description,
      heads,
      image,
      location,
      name,
      roomNo,
      rules,
      time,
      token,
    } = await editEventValidator.parseAsync(req.body);

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

    if (heads.length === 0) {
      return res
        .status(422)
        .json({ error: "Please select a head for this event" });
    }

    const event = await prisma.events.findUnique({
      where: {
        id,
      },
      include: {
        HeadsAndEvents: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    for await (const headAndEvent of event.HeadsAndEvents) {
      await prisma.headsAndEvents.delete({
        where: {
          headId: headAndEvent.headId,
          eventId: headAndEvent.eventId,
        },
      });
    }

    await prisma.headsAndEvents.createMany({
      data: heads.map((id) => {
        return { headId: id, eventId: event.id };
      }),
    });

    await prisma.events.update({
      where: {
        id,
      },
      data: {
        name,
        category,
        location,
        roomNo,
        rules,
        date,
        description,
        image,
        time,
      },
    });

    return res.status(201).json({ message: "Event updated successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.errors[0].message });
    } else {
      res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { editEventRouter };
