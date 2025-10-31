import type { Request } from "express";
import multer, { type StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, "../uploads/");
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

export default upload;
