import { Router } from "express";
import { ZodError } from "zod";

import prisma from "../libs/db";
import { resendOtpValidator } from "../validators/resend-otp-validator";
import { generateOtp } from "../libs/generate-otp";
import sendEmail from "../libs/send-email";

const resendOtpRouter = Router();

resendOtpRouter.post("/user", async (req, res) => {
  try {
    const { email } = await resendOtpValidator.parseAsync(req.body);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(409).json({ error: "Email is already verified" });
    }

    await prisma.otp.deleteMany({
      where: {
        userEmail: email,
      },
    });

    const otp = await generateOtp();
    await prisma.otp.create({
      data: {
        otp,
        userEmail: user.email,
        expiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const isEmailSent = await sendEmail(user.email, otp);
    if (!isEmailSent) {
      return res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }

    return res.status(200).json({ message: "OTP sent successfully" });
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

export { resendOtpRouter };
