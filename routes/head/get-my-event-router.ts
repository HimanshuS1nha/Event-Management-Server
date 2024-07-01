import { Router } from "express";

const getMyEventRouter = Router();

getMyEventRouter.post("/", (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {}
});

export { getMyEventRouter };
