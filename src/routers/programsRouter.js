import express from "express";
import {getProgramCreationPage, handleProgramCreation, handleProgramUploadImage, getProgramEditingPage, handleProgramEditing, handleProgramDeleting, getProgramDetailedPage} from "../controllers/programController.js";
import multer from "multer";
import {findProgramById} from "../controllers/middleware.js";

const programsRouter = express.Router();

programsRouter.get("/create", getProgramCreationPage);
programsRouter.post("/", express.json(), handleProgramCreation);

const extMap = {
  "image/jpeg": "jpg"
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'dist/public/images')
  },
  filename: function (req, file, cb) {
    const fileName = `program-${req.program.id}.${extMap[file.mimetype]}`;
    req.program.imgURL = `/images/${fileName}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })

programsRouter.patch("/:id/upload-image", findProgramById, upload.single("image"), handleProgramUploadImage);

programsRouter.get("/:id/edit", findProgramById, getProgramEditingPage);
programsRouter.patch("/:id", findProgramById, express.json(), handleProgramEditing);
programsRouter.delete("/:id", findProgramById, handleProgramDeleting);
programsRouter.get("/:id", findProgramById, getProgramDetailedPage);

export {programsRouter};