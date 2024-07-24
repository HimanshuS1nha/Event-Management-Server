import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

import { verifyValidator } from "../validators/verify-validator";
import prisma from "../libs/db";

const verifyRouter = Router();

verifyRouter.post("/user", async (req, res) => {
  try {
    const { email, otp } = await verifyValidator.parseAsync(req.body);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      const otpEntry = await prisma.otp.findUnique({
        where: {
          userEmail: user.email,
          otp: parseInt(otp),
        },
      });

      if (!otpEntry) {
        return res.status(422).json({ error: "Wrong OTP" });
      }

      if (otpEntry.expiresIn < new Date()) {
        return res.status(410).json({ error: "OTP expired" });
      }

      await prisma.otp.delete({
        where: {
          id: otpEntry.id,
        },
      });

      await prisma.users.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      });
    }

    return res.status(200).json({ message: "Verified successfully" });
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

verifyRouter.post("/admin", async (req, res) => {
  try {
    const { email, otp } = await verifyValidator.parseAsync(req.body);

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (parseInt(otp) !== admin.otp) {
      return res.status(422).json({ error: "Wrong OTP" });
    }

    if (admin.otpExpiresIn! < new Date()) {
      return res.status(410).json({ error: "OTP expired" });
    }

    await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        otp: null,
      },
    });

    const token = jwt.sign(admin.email, process.env.JWT_SECRET!);

    return res.status(200).json({ message: "Verified successfully", token });
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

export { verifyRouter };
