import mongoose from "mongoose";
import "colors";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {
            dbName: process.env.DB_NAME
        })
        console.log(`Connected to database with ${conn.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`Error: ${error}`.bgRed.white)
    }
}

export default connectDB;