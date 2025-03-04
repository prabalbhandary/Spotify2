import { v2 as cloudinary } from "cloudinary";
import Song from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    if (
      !req.files ||
      !req.files.audio ||
      !req.files.audio[0] ||
      !req.files.image ||
      !req.files.image[0]
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Audio or Image file is missing." });
    }
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)} : ${Math.floor(
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
    const song = new Song(songData);
    await song.save();
    return res.status(201).json({
      success: true,
      message: "Song Created Successfully",
      song: song,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await Song.find({});
    return res.status(200).json({
      success: true,
      message: "Songs Fetched Successfully",
      songs: allSongs,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const removeSong = async (req, res) => {
  try {
    const songId = req.body.id;
    const song = await Song.findById(songId);
    if (!song) {
      return res
        .status(404)
        .json({ success: false, message: "Song not found" });
    }
    if (song.file) {
      await cloudinary.uploader.destroy(
        song.file.split("/").pop().split(".")[0],
        { resource_type: "video" }
      );
    }
    if (song.image) {
      await cloudinary.uploader.destroy(
        song.image.split("/").pop().split(".")[0],
        { resource_type: "image" }
      );
    }
    await Song.findByIdAndDelete(songId);
    return res
      .status(200)
      .json({ success: true, message: "Song Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { addSong, listSong, removeSong };
