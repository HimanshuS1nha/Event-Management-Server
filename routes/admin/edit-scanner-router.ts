import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { editScannerValidator } from "../../validators/admin/edit-scanner-validator";

const editScannerRouter = Router();

editScannerRouter.post("/", async (req, res) => {
  try {
    const { token, newEmail, oldEmail } = await editScannerValidator.parseAsync(
      req.body
    );

    const adminEmail = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!adminEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email: adminEmail,
      },
    });
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const scanner = await prisma.scanner.findUnique({
      where: {
        email: oldEmail,
      },
    });
    if (!scanner) {
      return res.status(404).json({ error: "Scanner not found" });
    }

    await prisma.scanner.update({
      where: {
        id: scanner.id,
      },
      data: {
        email: newEmail,
      },
    });

    return res.status(201).json({ message: "Scanner edited successfully" });
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

export { editScannerRouter };
