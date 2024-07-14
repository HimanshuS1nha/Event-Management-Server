import { z } from "zod";

export const verifyValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please provide a valid email" }),
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, { message: "OTP must be 6 digits long" }),
});
