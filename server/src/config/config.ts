import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("MongoDB Connected");
    } catch (error) {
        logger.error(error);
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;
