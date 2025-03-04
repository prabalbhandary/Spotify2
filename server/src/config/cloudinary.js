import { v2 as cloudinary } from "cloudinary";
import "colors";

const connectCloudinary = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log(`Cloudinary Connected`.bgBlue.white);
  } catch (error) {
    console.log(`Error: ${error}`.bgRed.white);
  }
};

export default connectCloudinary;
