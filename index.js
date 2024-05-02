import dotenv from "dotenv";

import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import connectDB from "./config/connectDB.js";


dotenv.config({
  path: "./env",
});

const app = express();
const PORT = process.env.PORT || 8000;
const DATABASEURL = process.env.DATABASE_URL;
connectDB(DATABASEURL);
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.LocalFRONTEND_URL, process.env.FRONTEND_URL],
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);
app.use(express.urlencoded({ limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use("/api/user", userRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
