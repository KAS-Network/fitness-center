import express from "express";
import {getTrainerCreationPage, handleTrainerCreation, handleTrainerUploadImage, getTrainerEditingPage, handleTrainerEditing, handleTrainerDeleting, getTrainerDetailedPage} from "../controllers/trainersController.js";
import multer from "multer";
import {findTrainerById} from "../controllers/middleware.js";

const trainersRouter = express.Router();

trainersRouter.get("/create", getTrainerCreationPage);
trainersRouter.post("/", express.json(), handleTrainerCreation);

const extMap = {
  "image/jpeg": "jpg"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/public/images')
  },
  filename: function (req, file, cb) {
    const fileName = `trainer-${req.trainer.id}.${extMap[file.mimetype]}`;
    req.trainer.imgURL = `/images/${fileName}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })

trainersRouter.patch("/:id/upload-image", findTrainerById, upload.single("image"), handleTrainerUploadImage);

trainersRouter.get("/:id/edit", findTrainerById, getTrainerEditingPage);
trainersRouter.patch("/:id", findTrainerById, express.json(), handleTrainerEditing);
trainersRouter.delete("/:id", findTrainerById, handleTrainerDeleting);
trainersRouter.get("/:id", findTrainerById, getTrainerDetailedPage);

export {trainersRouter};