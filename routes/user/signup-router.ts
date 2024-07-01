import { Router } from "express";
import { ZodError } from "zod";
import { hash } from "bcrypt";

import { signupValidator } from "../../validators/user/signup-validator";
import prisma from "../../libs/db";
import { generateOtp } from "../../libs/generate-otp";
import sendEmail from "../../libs/send-email";

const signupRouter = Router();

signupRouter.post("/user", async (req, res) => {
  try {
    const {
      branch,
      confirmPassword,
      email,
      name,
      password,
      phoneNumber,
      rollNo,
      year,
      image,
    } = await signupValidator.parseAsync(req.body);

    if (password !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const user = await prisma.users.findMany({
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
    if (user.length > 0) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        branch,
        email,
        name,
        password: hashedPassword,
        phoneNumber,
        rollNo,
        year,
        image,
      },
    });

    const otp = await generateOtp();
    await prisma.otp.create({
      data: {
        otp,
        userEmail: email,
      },
    });
    const isEmailSent = await sendEmail(email, otp);
    if (!isEmailSent) {
      return res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.errors[0].message });
    } else {
      return res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { signupRouter };
