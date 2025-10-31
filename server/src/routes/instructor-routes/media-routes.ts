import express, { type Request, type Response } from "express";
import upload from "../../middlewares/multer.middleware.js";
import {
    deleteMediaFromCloudinary,
    uploadMediaToCloudinary,
} from "../../helpers/cloudinary.js";
import logger from "../../config/logger.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Please upload some file first!",
            });
        }
        const result = await uploadMediaToCloudinary(req.file?.path);
        return res.status(200).json({
            success: true,
            data: result,
            message: "File uploaded successfully",
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Error uploading file",
        });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Asset id is required",
            });
        }

        await deleteMediaFromCloudinary(id);

        return res.status(200).json({
            success: true,
            message: "Asset deleted successfully!",
        });
    } catch (error) {
        logger.error(error);

        return res.status(500).json({
            success: false,
            message: "Error while deleting file",
        });
    }
});

router.post(
    "/bulk-upload",
    upload.array("files", 10),
    async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Please select files!",
                });
            }

            const uploadPromises = files.map((fileItem) =>
                uploadMediaToCloudinary(fileItem.path)
            );

            const results = await Promise.all(uploadPromises);

            return res.status(200).json({
                success: true,
                data: results,
                message: "Files uploaded successfully",
            });
        } catch (e) {
            logger.error(e);
            return res.status(500).json({
                success: false,
                message: "Error in bulk uploading files",
            });
        }
    }
);

export default router;
