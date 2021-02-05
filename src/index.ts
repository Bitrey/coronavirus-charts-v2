import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import schedule from "node-schedule";
import dotenv from "dotenv";
import localeMiddleware from "express-locale";
import path from "path";
import _ from "lodash";
import clientRoutes from "./routes/client";
import apiRoutes from "./routes/api";
import TotalData from "./classes/TotalData";

// Dotenv
dotenv.config();

// Express
const app = express();
app.set("view engine", "ejs");

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cookie parser
app.use(cookieParser());

// Locale middleware
app.use(localeMiddleware());

// Set public folder
app.use(express.static(path.join(__dirname, "..", "public")));

export const countriesData = new TotalData();

// API responses
app.use("/api", apiRoutes);

// Client responses
app.use("/", clientRoutes);

// Schedule update
schedule.scheduleJob("0 0 * * * *", () => countriesData.updateData());

// Start server
const PORT = Number(process.env.PORT) || 3000;
const IP = process.env.IP || "127.0.0.1";
app.listen(PORT, IP, () => {
    console.log(`Server started on ${IP}:${PORT}`);
});
