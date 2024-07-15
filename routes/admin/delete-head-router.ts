import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { deleteHeadValidator } from "../../validators/admin/delete-head-validator";

const deleteHeadRouter = Router();

deleteHeadRouter.post("/", async (req, res) => {
  try {
    const { id, token } = await deleteHeadValidator.parseAsync(req.body);
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

    await prisma.heads.delete({
      where: {
        id,
      },
    });

    return res.status(201).json({ message: "Head deleted successfully" });
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

export { deleteHeadRouter };
