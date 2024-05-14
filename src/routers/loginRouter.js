import express from "express";
import {getLoginPage, handleLogin} from "../controllers/loginController.js";

const loginRouter = express.Router();

loginRouter.get("/", getLoginPage);
loginRouter.post("/", express.urlencoded({extended: false}), handleLogin);

export {loginRouter};