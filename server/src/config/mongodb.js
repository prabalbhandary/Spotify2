import mongoose from "mongoose";
import "colors"

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('Mongodb connection has been established!'.bgGreen.white)
    } catch (error) {
        console.log('MongoDb connection has failed'.bgRed.white, error.message);
    }
}

export default connectDB;