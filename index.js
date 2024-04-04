import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import connectDB from "./config/connectDB.js";

const app = express();
const PORT = process.env.PORT || 8000;
const DATABASEURL = process.env.DATABASE_URL;
connectDB(DATABASEURL);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(
  cors({
    origin: "http://flightapp-wine.vercel.app",
    credentials: true,
    preflightContinue: true,
  }),
);
app.use(express.urlencoded({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
