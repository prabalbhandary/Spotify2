import { v2 as cloudinary } from "cloudinary"
import "colors"

const connectCloudinary = async () => {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
        })
        console.log('Cloudinary connection has been established!'.bgBlue.white)
    } catch (error) {
        console.log('Cloudinary connection has failed'.bgRed.white, error.message);
    }
}

export default connectCloudinary;