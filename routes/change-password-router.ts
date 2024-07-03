import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt";

import prisma from "../libs/db";
import { changePasswordValidator } from "../validators/change-password-validator";

const changePasswordRouter = Router();

changePasswordRouter.post("/user", async (req, res) => {
  try {
    const { confirmPassword, newPassword, oldPassword, token } =
      await changePasswordValidator.parseAsync(req.body);

    const email = jwt.verify(token, process.env.JWT_SECRET!) as string;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const doesPasswordMatch = await compare(oldPassword, user.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Password changed successfully" });
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

changePasswordRouter.post("/head", async (req, res) => {
  try {
    const { confirmPassword, newPassword, oldPassword, token } =
      await changePasswordValidator.parseAsync(req.body);

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

    if (newPassword !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const doesPasswordMatch = await compare(oldPassword, head.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.heads.update({
      where: {
        id: head.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Password changed successfully" });
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

export { changePasswordRouter };
