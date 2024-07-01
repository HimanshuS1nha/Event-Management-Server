import { Router } from "express";
import { verifyValidator } from "../../validators/user/verify-validator";
import prisma from "../../libs/db";
import { ZodError } from "zod";

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

export { verifyRouter };
