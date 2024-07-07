import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { scannerValidator } from "../../validators/scanner/scanner-validator";

const userExitRouter = Router();

userExitRouter.post("/", async (req, res) => {
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
    if (!user.hasEntered) {
      return res.status(409).json({ error: "User has not entered yet", user });
    }

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        hasEntered: false,
      },
    });

    return res.status(201).json({ error: "Exit successful", user });
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

export { userExitRouter };
