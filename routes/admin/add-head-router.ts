import { Router } from "express";
import { ZodError } from "zod";
import { hash } from "bcrypt";

import { addHeadValidator } from "../../validators/admin/add-head-validator";
import prisma from "../../libs/db";

const addHeadRouter = Router();

addHeadRouter.post("/", async (req, res) => {
  try {
    const { confirmPassword, email, image, name, password, phoneNumber } =
      await addHeadValidator.parseAsync(req.body);

    if (password !== confirmPassword) {
      return res.status(403).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.heads.create({
      data: {
        email,
        image,
        name,
        password: hashedPassword,
        phoneNumber,
      },
    });

    return res.status(201).json({ message: "Head added successfully" });
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

export { addHeadRouter };
