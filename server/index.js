import express from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import connectCloudinary from "./src/config/cloudinary.js";
import songRoutes from "./src/routes/songRoutes.js";
import albumRoutes from "./src/routes/albumRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/albums", albumRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`.bgMagenta.white);
  connectCloudinary();
});
