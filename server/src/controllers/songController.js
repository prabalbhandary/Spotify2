import { v2 as cloudinary } from "cloudinary";
import Song from "../models/Song.js";

const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    const song = Song(songData);
    await song.save();

    res.status(201).json({ success: true, message: "Song Added" });
  } catch (error) {
    console.log("Failed at addSong, ", error);
    res.status(400).json({ success: false, message: "Song Add Failed" });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await Song.find({}).sort({ createdAt: -1 });
    res.status(201).json({ success: true, message: "Song List Fetched Success", songs: allSongs });
  } catch (error) {
    console.log("Failed at listSong, ", error);
    res.status(400).json({ success: false, message: "Song List Failed" });
  }
};

const removeSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }

    const imagePublicId = song.image.split("/").pop().split(".")[0];
    const filePublicId = song.file.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(imagePublicId, {
      resource_type: "image",
    });
    await cloudinary.uploader.destroy(filePublicId, { resource_type: "video" });

    await Song.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        success: true,
        message: "Song removed and files deleted from Cloudinary",
      });
  } catch (error) {
    console.log("Failed at removeSong, ", error);
    res.status(400).json({ success: false, message: "Song remove failed" });
  }
};

export { addSong, listSong, removeSong };
