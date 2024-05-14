import {getMainPage} from "../controllers/homeController.js";
import express from "express";

const homeRouter = express.Router();

homeRouter.get("/", getMainPage);

export {homeRouter};