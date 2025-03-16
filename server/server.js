import express from "express";
import cors from "cors"
import "dotenv/config"
import "colors"
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

const __dirname = path.resolve();

const corsOptions = {
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true
}

//middlewares
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//initializing routes
app.use("/api/song", songRouter)
app.use("/api/album", albumRouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "./admin/dist/index.html"));
});


app.listen(port, () => console.log(`Server started http://localhost:${port}`.bgMagenta.white));
