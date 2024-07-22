import { Router } from "express";
import jwt from "jsonwebtoken";

import prisma from "../../libs/db";
import { getHeadsDetailsValidator } from "../../validators/admin/get-heads-details-validator";

const getHeadsDetails = Router();

getHeadsDetails.post("/", async (req, res) => {
  try {
    const { token, heads } = await getHeadsDetailsValidator.parseAsync(
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

    let allHeads: { id: string; name: string }[] = [];

    const dbHeads = await prisma.heads.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        phoneNumber: true,
        HeadsAndEvents: true,
      },
    });

    for await (const head of dbHeads) {
      if (head.HeadsAndEvents.length === 0 || heads.includes(head.id)) {
        allHeads.push({
          id: head.id,
          name: head.name,
        });
      }
    }

    return res.status(200).json({ allHeads });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getHeadsDetails };
