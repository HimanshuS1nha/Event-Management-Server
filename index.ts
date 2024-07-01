import express from "express";
import cors from "cors";

import { loginRouter } from "./routes/login-router";
import { signupRouter } from "./routes/user/signup-router";
import { verifyRouter } from "./routes/user/verify-router";
import { addHeadRouter } from "./routes/admin/add-head-router";
import { addEventRouter } from "./routes/admin/add-event-router";
import { getEventsRouter } from "./routes/get-events-router";
import { registerForEventRouter } from "./routes/user/register-for-event-router";
import { getMyEventsRouter } from "./routes/user/get-my-events-router";
import { getHeadDetailsRouter } from "./routes/get-head-details-router";
import { isUserAlreadyRegisteredRouter } from "./routes/user/is-user-already-registered-router";
import { getMyEventRouter } from "./routes/head/get-my-event-router";

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
app.use("/api/get-my-event", getMyEventRouter);

app.get("/", (_, res) => {
  return res.send("Hello");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
