import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";

const getAllScannersRouter = Router();

getAllScannersRouter.post("/", async (req, res) => {
  try {
    const { token } = req.body;
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

    const allScanners = await prisma.scanner.findMany();

    return res.status(200).json({ allScanners });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getAllScannersRouter };
