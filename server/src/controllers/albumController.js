import { v2 as cloudinary } from "cloudinary";
import Album from "../models/Album.js";
import Song from "./../models/Song.js";

const addAlbum = async (req, res) => {
  try {
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    const album = Album(albumData);
    await album.save();

    res.status(201).json({ success: true, message: "Album Added" });
  } catch (error) {
    console.log("Failed at addAlbum, ", error);
    res.status(400).json({ success: false, message: "Album Add Failed" });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await Album.find({}).sort({ createdAt: -1 });
    res.status(201).json({ success: true, message: "Album List Fetched Success", albums: allAlbums });
  } catch (error) {
    console.log("Failed at listAlbum, ", error);
    res.status(400).json({ success: false, message: "Album List Failed" });
  }
};

const removeAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const album = await Album.findById(id);
    if (!album) {
      return res
        .status(404)
        .json({ success: false, message: "Album not found" });
    }

    const albumSongs = await Song.find({ album: album.name });

    for (const song of albumSongs) {
      const imagePublicId = song.image.split("/").pop().split(".")[0];
      const filePublicId = song.file.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(imagePublicId, {
        resource_type: "image",
      });
      await cloudinary.uploader.destroy(filePublicId, {
        resource_type: "video",
      });

      await Song.findByIdAndDelete(song._id);
    }

    await Album.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Album and associated songs removed successfully, files deleted from Cloudinary",
    });
  } catch (error) {
    console.log("Failed at removeAlbum, ", error);
    res.status(400).json({ success: false, message: "Album remove failed" });
  }
};

export { addAlbum, listAlbum, removeAlbum };
