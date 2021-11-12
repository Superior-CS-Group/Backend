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

const app = express();
app.use(cors());
export const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.WISHIFYDATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
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

app.get("/", (req, res) => res.status(200).send("Yes its working"));

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
