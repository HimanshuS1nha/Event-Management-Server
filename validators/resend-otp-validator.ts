import { z } from "zod";

export const resendOtpValidator = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is invalid" }),
});
