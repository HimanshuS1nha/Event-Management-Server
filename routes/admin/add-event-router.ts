import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { addEventValidator } from "../../validators/admin/add-event-validator";
import prisma from "../../libs/db";

const addEventRouter = Router();

addEventRouter.post("/", async (req, res) => {
  try {
    const {
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
    } = await addEventValidator.parseAsync(req.body);

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

    const event = await prisma.events.create({
      data: {
        category,
        description,
        image,
        location,
        name,
        time,
        date,
        roomNo,
        rules,
      },
    });

    await prisma.headsAndEvents.createMany({
      data: heads.map((id) => {
        return { headId: id, eventId: event.id };
      }),
    });

    return res.status(201).json({ message: "Event added successfully" });
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

export { addEventRouter };
