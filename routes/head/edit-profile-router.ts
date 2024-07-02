import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { editProfileValidator } from "../../validators/head/edit-profile-validator";
import prisma from "../../libs/db";

const editProfileRouter = Router();

editProfileRouter.post("/", async (req, res) => {
  try {
    const { image, name, phoneNumber, token } =
      await editProfileValidator.parseAsync(req.body);

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

    const newHead = await prisma.heads.update({
      where: {
        email: head.email,
      },
      data: {
        name,
        image,
        phoneNumber,
      },
    });

    return res.status(201).json({ head: newHead });
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

export { editProfileRouter };
