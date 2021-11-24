import express from "express";
import mongoose from "mongoose";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config("./.env");

import UserRoute from "./route/customer.js";
import AdminRoute from "./route/admin.js";
import EstimaitonRoute from "./route/estimation.js";
import ServicesRoute from "./route/services.js";
import StaffRoute from "./route/staff.js";
import LeadSourceRoute from "./route/leadsource.js";
import UserRoleRoute from "./route/userrole.js";
import UnitRoute from "./route/unit.js";
import StatusNameRoute from "./route/statusName.js";
import FormulaRoute from "./route/formula/formula.route.js"; 
import EmailTemplateRoute from "./route/emailTemplate.js";

const app = express();
app.use(cors());
export const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.ONEPERCENTDATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log("error:", error));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

// to log which api is hitting
app.use(morgan("dev"));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", UserRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/customer", UserRoute);
app.use("/api/estimation", EstimaitonRoute);
app.use("/api/services", ServicesRoute);
app.use("/api/staff", StaffRoute);
app.use("/api/lead-source", LeadSourceRoute);
app.use("/api/user-role", UserRoleRoute);
app.use("/api/unit", UnitRoute);
app.use("/api/status", StatusNameRoute);
app.use("/api/formula", FormulaRoute);
app.use("/api/email-template", EmailTemplateRoute);

app.get("/", (_req, res) => res.status(200).send("Yes its working"));

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
