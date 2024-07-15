import { Router } from "express";
import { ZodError } from "zod";

const deleteHeadRouter = Router();

deleteHeadRouter.post("/", (req, res) => {
  try {
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

export { deleteHeadRouter };
