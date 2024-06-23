import { Router } from "express";
import { ZodError } from "zod";

import { getEventsValidator } from "../validators/user/get-events-validator";
import prisma from "../libs/db";

const getEventsRouter = Router();

getEventsRouter.post("/", async (req, res) => {
  try {
    const { category } = await getEventsValidator.parseAsync(req.body);

    const events = await prisma.events.findMany({
      where: {
        category,
      },
      select: {
        category: true,
        date: true,
        description: true,
        image: true,
        id: true,
        location: true,
        name: true,
        roomNo: true,
        rules: true,
        time: true,
        HeadsAndEvents: {
          select: {
            headId: true,
          },
        },
      },
    });

    return res.status(200).json({ events });
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

export { getEventsRouter };
