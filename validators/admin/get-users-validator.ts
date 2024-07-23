import { z } from "zod";

export const getUsersValidator = z.object({
  token: z
    .string({ required_error: "Unauthorized" })
    .trim()
    .min(1, { message: "Unauthorized" }),
  pageNumber: z.number({ required_error: "Page Number is required" }),
  perPage: z.number({ required_error: "Per Page is required" }),
});
