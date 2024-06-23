import { z } from "zod";

export const signupValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  image: z
    .string({ required_error: "Image is required" })
    .trim()
    .min(1, { message: "Image is required" }),
  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .trim()
    .length(10, { message: "Phone number must be 10 digits long" }),
  branch: z
    .string({ required_error: "Branch is required" })
    .trim()
    .min(1, { message: "Branch is required" }),
  year: z
    .string({ required_error: "Year is required" })
    .trim()
    .min(1, { message: "Year is required" }),
  rollNo: z
    .string({ required_error: "Roll Number is required" })
    .trim()
    .min(1, { message: "Roll Number is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be atleast 8 characters long" }),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .trim()
    .min(8, { message: "Confirm Password must be atleast 8 characters long" }),
});
