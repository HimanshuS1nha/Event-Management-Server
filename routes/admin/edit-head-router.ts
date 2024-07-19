import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { editHeadValidator } from "../../validators/admin/edit-head-validator";

const editHeadRouter = Router();

editHeadRouter.post("/", async (req, res) => {
  try {
    const { image, name, phoneNumber, token, id } =
      await editHeadValidator.parseAsync(req.body);

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

    const head = await prisma.heads.findUnique({
      where: {
        id,
      },
    });
    if (head) {
      return res.status(404).json({ error: "Head not found" });
    }

    await prisma.heads.update({
      where: {
        id,
      },
      data: {
        image,
        name,
        phoneNumber,
      },
    });

    return res.status(201).json({ message: "Details edited successfully" });
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

export { editHeadRouter };
