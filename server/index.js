import express from "express";
import "colors";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./src/config/db.js";
import connectCloudinary from "./src/config/cloudinary.js";
import songRoutes from "./src/routes/songRoutes.js";
import albumRoutes from "./src/routes/albumRoutes.js";

dotenv.config();

const app = express();

const __dirname = path.resolve();

const corsOptions = {
  origin: [process.env.URL1, process.env.URL2],
  credentials: true,
};

const port = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/albums", albumRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.use(express.static(path.join(__dirname, "/admin/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "admin", "dist", "index.html"));
});

app.listen(port, () => {
  connectDB();
  console.log(`Server running on http://localhost:${port}`.bgMagenta.white);
  connectCloudinary();
});
