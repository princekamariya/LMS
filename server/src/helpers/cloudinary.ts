import { v2 as cloudinary } from "cloudinary";
import logger from "../config/logger.js";
import { error } from "console";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key: process.env.CLOUDINARY_API_KEY ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

const uploadMediaToCloudinary = async (filePath: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        return result;
    } catch (error) {
        logger.error(error);
        throw new Error("Error uploading to cloudinary");
    }
};

const deleteMediaFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        logger.error(error);
        throw new Error("failed to delete asset from cloudinary");
    }
};

export { uploadMediaToCloudinary, deleteMediaFromCloudinary };
