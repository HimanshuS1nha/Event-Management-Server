import { Router } from "express";
import { hash } from "bcrypt";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { addScannerValidator } from "../../validators/admin/add-scanner-validator";

const addScannerRouter = Router();

addScannerRouter.post("/", async (req, res) => {
  try {
    const { email, password, token } = await addScannerValidator.parseAsync(
      req.body
    );

    const adminEmail = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!adminEmail || adminEmail !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const scanner = await prisma.scanner.findUnique({
      where: {
        email,
      },
    });
    if (scanner) {
      return res.status(401).json({ error: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.scanner.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: "Scanner added successfully",
    });
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

export { addScannerRouter };
