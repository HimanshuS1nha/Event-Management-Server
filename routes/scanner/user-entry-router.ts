import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { scannerValidator } from "../../validators/scanner/scanner-validator";

const userEntryRouter = Router();

userEntryRouter.post("/", async (req, res) => {
  try {
    const { id, token } = await scannerValidator.parseAsync(req.body);

    const email = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const scanner = await prisma.scanner.findUnique({
      where: {
        email,
      },
    });
    if (!scanner) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        branch: true,
        year: true,
        image: true,
        hasEntered: true,
        phoneNumber: true,
        rollNo: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.hasEntered) {
      return res
        .status(200)
        .json({ error: "User has already entered", user, isSuccess: false });
    }

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        hasEntered: true,
      },
    });

    return res
      .status(201)
      .json({ error: "Entry successful", user, isSuccess: true });
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

export { userEntryRouter };
