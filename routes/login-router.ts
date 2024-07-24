import { Router } from "express";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

import { loginValidator } from "../validators/login-validator";
import prisma from "../libs/db";
import { generateOtp } from "../libs/generate-otp";
import sendEmail from "../libs/send-email";

const loginRouter = Router();

loginRouter.post("/user", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        branch: true,
        password: true,
        year: true,
        email: true,
        isVerified: true,
        phoneNumber: true,
        rollNo: true,
        image: true,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doesPasswordMatch = await compare(password, user.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      await prisma.otp.deleteMany({
        where: {
          userEmail: user.email,
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

      return res
        .status(200)
        .json({ verified: false, message: "Please verify your email" });
    }

    const { password: _, ...restUser } = user;
    const token = jwt.sign(user.email, process.env.JWT_SECRET!);

    return res.status(200).json({
      message: "Logged in successfully",
      user: restUser,
      verified: user.isVerified,
      token,
    });
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

loginRouter.post("/head", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const head = await prisma.heads.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        password: true,
        email: true,
        image: true,
        phoneNumber: true,
      },
    });
    if (!head) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doesPasswordMatch = await compare(password, head.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...restHead } = head;
    const token = jwt.sign(head.email, process.env.JWT_SECRET!);

    return res.status(200).json({
      message: "Logged in successfully",
      head: restHead,
      token,
    });
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

loginRouter.post("/scanner", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const scanner = await prisma.scanner.findUnique({
      where: {
        email,
      },
    });
    if (!scanner) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doesPasswordMatch = await compare(password, scanner.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(scanner.email, process.env.JWT_SECRET!);

    return res.status(200).json({
      message: "Logged in successfully",
      token,
    });
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

loginRouter.post("/admin", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doesPasswordMatch = await compare(password, admin.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const otp = await generateOtp();
    await prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        otp,
        otpExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const isEmailSent = await sendEmail(admin.email, otp);
    if (!isEmailSent) {
      return res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }

    return res.status(200).json({
      message: "Otp sent successfully",
    });
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

export { loginRouter };
