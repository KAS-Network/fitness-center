import express from "express";
import {getFitnessCenterEditingPage, handleFitnessCenterEditing, handleFitnessCenterUploadImage} from "../controllers/fitnessCentersController.js";
import multer from "multer";

const fitnessCentersRouter = express.Router();

fitnessCentersRouter.get("/:id/edit", getFitnessCenterEditingPage);
fitnessCentersRouter.patch("/:id", express.json(), handleFitnessCenterEditing);

const extMap = {
  "image/jpeg": "jpg"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/public/images')
  },
  filename: function (req, file, cb) {
    cb(null, `hero-bg.${extMap[file.mimetype]}`);
  }
})

const upload = multer({ storage: storage })

fitnessCentersRouter.patch("/:id/upload-image", upload.single("image"), handleFitnessCenterUploadImage);

export {fitnessCentersRouter};