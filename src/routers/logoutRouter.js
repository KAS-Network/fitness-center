import express from "express";
import {handleLogout} from "../controllers/logoutController.js";

const logoutRouter = express.Router();

logoutRouter.get("/", handleLogout);

export {logoutRouter};