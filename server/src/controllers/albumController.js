import { v2 as cloudinary } from "cloudinary";
import Album from "../models/albumModel.js";

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgColour = req.body.bgColour;
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
    return res
      .status(201)
      .json({
        success: true,
        message: "Album Created Successfully",
        album: album,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await Album.find({});
    return res
      .status(200)
      .json({
        success: true,
        message: "Albums Fetched Successfully",
        albums: allAlbums,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const removeAlbum = async (req, res) => {
  try {
    const albumId = req.body.id;
    const album = await Album.findById(albumId);
    if (!album) {
      return res
        .status(404)
        .json({ success: false, message: "Album not found" });
    }
    if (album.image) {
      await cloudinary.uploader.destroy(
        album.image.split("/").pop().split(".")[0],
        { resource_type: "image" }
      );
    }
    await Album.findByIdAndDelete(albumId);
    return res
      .status(200)
      .json({ success: true, message: "Album Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { addAlbum, listAlbum, removeAlbum };
