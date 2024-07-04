import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import {
  editProfileValidatorHead,
  editProfileValidatorUser,
} from "../validators/edit-profile-validator";
import prisma from "../libs/db";

const editProfileRouter = Router();

editProfileRouter.post("/user", async (req, res) => {
  try {
    const { image, name, phoneNumber, token, branch, rollNo, year } =
      await editProfileValidatorUser.parseAsync(req.body);

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

    const newUser = await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        name,
        image,
        phoneNumber,
        branch,
        rollNo,
        year,
      },
    });

    return res.status(201).json({ user: newUser });
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

editProfileRouter.post("/head", async (req, res) => {
  try {
    const { image, name, phoneNumber, token } =
      await editProfileValidatorHead.parseAsync(req.body);

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

    const newHead = await prisma.heads.update({
      where: {
        email: head.email,
      },
      data: {
        name,
        image,
        phoneNumber,
      },
    });

    return res.status(201).json({ head: newHead });
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

export { editProfileRouter };
