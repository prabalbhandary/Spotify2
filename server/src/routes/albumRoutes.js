import express from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
} from "../controllers/albumController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/add", upload.single("image"), addAlbum);
router.get("/list", listAlbum);
router.post("/remove", removeAlbum);

export default router;
