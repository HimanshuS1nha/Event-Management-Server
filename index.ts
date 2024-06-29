import express from "express";
import cors from "cors";

import { loginRouter } from "./routes/login-router";
import { signupRouter } from "./routes/signup-router";
import { verifyRouter } from "./routes/verify-router";
import { addHeadRouter } from "./routes/add-head-router";
import { addEventRouter } from "./routes/add-event-router";
import { getEventsRouter } from "./routes/get-events-router";
import { registerForEventRouter } from "./routes/register-for-event-router";
import { getMyEventsRouter } from "./routes/get-my-events-router";
import { getHeadDetailsRouter } from "./routes/get-head-details-router";
import { isUserAlreadyRegisteredRouter } from "./routes/is-user-already-registered-router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/get-events", getEventsRouter);
app.use("/api/add-head", addHeadRouter);
app.use("/api/add-event", addEventRouter);
app.use("/api/register-for-event", registerForEventRouter);
app.use("/api/is-user-already-registered", isUserAlreadyRegisteredRouter);
app.use("/api/get-my-events", getMyEventsRouter);
app.use("/api/get-head-details", getHeadDetailsRouter);

app.get("/", (_, res) => {
  return res.send("Hello");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
