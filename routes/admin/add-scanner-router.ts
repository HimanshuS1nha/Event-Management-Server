import { Router } from "express";
import { hash } from "bcrypt";
import { ZodError } from "zod";

import prisma from "../../libs/db";
import { addScannerValidator } from "../../validators/admin/add-scanner-validator";

const addScannerRouter = Router();

addScannerRouter.post("/", async (req, res) => {
  try {
    const { email, password } = await addScannerValidator.parseAsync(req.body);

    const scanner = await prisma.scanner.findUnique({
      where: {
        email,
      },
    });
    if (!scanner) {
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
