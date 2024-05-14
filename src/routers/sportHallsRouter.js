import express from "express";
import {getSportHallCreationPage, handleSportHallCreation, handleSportHallUploadImage, getSportHallEditingPage, handleSportHallEditing, handleSportHallDeleting, getSportHallDetailedPage} from "../controllers/sportHallsController.js";
import multer from "multer";
import {findSportHallById} from "../controllers/middleware.js";

const sportHallsRouter = express.Router();

sportHallsRouter.get("/create", getSportHallCreationPage);
sportHallsRouter.post("/", express.json(), handleSportHallCreation);

const extMap = {
  "image/jpeg": "jpg"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/public/images')
  },
  filename: function (req, file, cb) {
    const fileName = `sport-hall-${req.sportHall.id}.${extMap[file.mimetype]}`;
    req.sportHall.imgURL = `/images/${fileName}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })

sportHallsRouter.patch("/:id/upload-image", findSportHallById, upload.single("image"), handleSportHallUploadImage);

sportHallsRouter.get("/:id/edit", findSportHallById, getSportHallEditingPage);
sportHallsRouter.patch("/:id", findSportHallById, express.json(), handleSportHallEditing);
sportHallsRouter.delete("/:id", findSportHallById, handleSportHallDeleting);
sportHallsRouter.get("/:id", findSportHallById, getSportHallDetailedPage);

export {sportHallsRouter};