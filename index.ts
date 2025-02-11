import express from "express";
import cors from "cors";

import { loginRouter } from "./routes/login-router";
import { signupRouter } from "./routes/user/signup-router";
import { verifyRouter } from "./routes/verify-router";
import { addHeadRouter } from "./routes/admin/add-head-router";
import { addEventRouter } from "./routes/admin/add-event-router";
import { getEventsRouter } from "./routes/get-events-router";
import { registerForEventRouter } from "./routes/user/register-for-event-router";
import { getMyEventsRouter } from "./routes/user/get-my-events-router";
import { getHeadDetailsRouter } from "./routes/get-head-details-router";
import { isUserAlreadyRegisteredRouter } from "./routes/user/is-user-already-registered-router";
import { getMyEventRouter } from "./routes/head/get-my-event-router";
import { getRegisteredStudentsRouter } from "./routes/head/get-registered-students-router";
import { editProfileRouter } from "./routes/edit-profile-router";
import { editEventDetailsRouter } from "./routes/head/edit-event-details-router";
import { changePasswordRouter } from "./routes/change-password-router";
import { addScannerRouter } from "./routes/admin/add-scanner-router";
import { userEntryRouter } from "./routes/scanner/user-entry-router";
import { userExitRouter } from "./routes/scanner/user-exit-router";
import { getAllHeadsRouter } from "./routes/admin/get-all-heads-router";
import { deleteRouter } from "./routes/admin/delete-router";
import { getAllScannersRouter } from "./routes/admin/get-all-scanners-router";
import { editHeadRouter } from "./routes/admin/edit-head-router";
import { getUnassignedHeadsRouter } from "./routes/admin/get-unassigned-heads-router";
import { getHeadsDetails } from "./routes/admin/get-heads-details-router";
import { editEventRouter } from "./routes/admin/edit-event-router";
import { getUsersRouter } from "./routes/admin/get-users-router";
import { resendOtpRouter } from "./routes/resend-otp-router";

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
app.use("/api/add-scanner", addScannerRouter);
app.use("/api/register-for-event", registerForEventRouter);
app.use("/api/is-user-already-registered", isUserAlreadyRegisteredRouter);
app.use("/api/get-my-events", getMyEventsRouter);
app.use("/api/get-head-details", getHeadDetailsRouter);
app.use("/api/get-my-event", getMyEventRouter);
app.use("/api/get-registered-students", getRegisteredStudentsRouter);
app.use("/api/edit-profile", editProfileRouter);
app.use("/api/edit-event-details", editEventDetailsRouter);
app.use("/api/change-password", changePasswordRouter);
app.use("/api/user-entry", userEntryRouter);
app.use("/api/user-exit", userExitRouter);
app.use("/api/get-all-heads", getAllHeadsRouter);
app.use("/api/get-all-scanners", getAllScannersRouter);
app.use("/api/delete", deleteRouter);
app.use("/api/edit-head", editHeadRouter);
app.use("/api/get-unassigned-heads", getUnassignedHeadsRouter);
app.use("/api/get-heads-details", getHeadsDetails);
app.use("/api/edit-event", editEventRouter);
app.use("/api/get-users", getUsersRouter);
app.use("/api/resend-otp", resendOtpRouter);

app.get("/", (_, res) => {
  return res.send("Hello");
});

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
