import { z } from "zod";

export const addEventValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
  category: z
    .string({ required_error: "Category is required" })
    .trim()
    .min(1, { message: "Category is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, { message: "Description is required" }),
  location: z
    .string({ required_error: "Location is required" })
    .trim()
    .min(1, { message: "Location is required" }),
  roomNo: z.number().nullable(),
  image: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(1, { message: "Image is required" }),
  time: z
    .string({ required_error: "Time is required" })
    .trim()
    .min(1, { message: "Time is required" }),
  date: z.string().optional(),
  rules: z.array(z.string()).optional(),
  heads: z.array(z.string()),
});
