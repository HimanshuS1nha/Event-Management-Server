import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { getUsersValidator } from "../../validators/admin/get-users-validator";

const getUsersRouter = Router();

getUsersRouter.post("/", async (req, res) => {
  try {
    const { pageNumber, perPage, token } = await getUsersValidator.parseAsync(
      req.body
    );

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

    const users = await prisma.users.findMany({
      skip: pageNumber * perPage,
      take: perPage,
      select: {
        name: true,
        id: true,
        branch: true,
        year: true,
        image: true,
      },
    });

    const totalNumberOfUsers = await prisma.users.count();

    return res.status(200).json({ users, totalNumberOfUsers });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.errors[0].message });
    } else {
      res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { getUsersRouter };
