import { Router } from "express";
import { ZodError } from "zod";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

import { addHeadValidator } from "../../validators/admin/add-head-validator";
import prisma from "../../libs/db";

const addHeadRouter = Router();

addHeadRouter.post("/", async (req, res) => {
  try {
    const {
      confirmPassword,
      email,
      image,
      name,
      password,
      phoneNumber,
      token,
    } = await addHeadValidator.parseAsync(req.body);

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

    if (password !== confirmPassword) {
      return res.status(403).json({ error: "Passwords do not match" });
    }

    const head = await prisma.heads.findMany({
      where: {
        OR: [
          {
            email,
          },
          {
            phoneNumber,
          },
        ],
      },
    });
    if (head.length !== 0) {
      return res
        .status(409)
        .json({ error: "Email or phone number already exists" });
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
    console.log(error);
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
