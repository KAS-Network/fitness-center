import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {User} from "../models/userModel.js";
import {SportHallModel} from "../models/sportHallModel.js";
import {TrainerModel} from "../models/trainerModel.js";
import {ProgramModel} from "../models/programModel.js";

dotenv.config();

export async function auth(req, res, next) {
  if (!req.cookies || !req.cookies.token) {
    return next();
  }
  const token = req.cookies.token;
  try {
    const payload = jwt.verify(token, process.env.PRIVATE_KEY);
    const userId = payload.userId;
    const user = await User.getUserById(userId);
    if (user !== null) {
      req.user = user;
    }
    return next();
  } catch (err) {
    res.clearCookie("token");
    return next();
  }
}

export function findSportHallById(req, res, next) {
  const sportHallId = req.params.id;
  const sportHall = SportHallModel.findById(sportHallId);
  if (!sportHall) {
    return res.sendStatus(404);
  }
  req.sportHall = sportHall
  return next();
}

export function findTrainerById(req, res, next) {
  const trainerId = req.params.id;
  const trainer = TrainerModel.findById(trainerId);
  if (!trainer) {
    return res.sendStatus(404);
  }
  req.trainer = trainer
  return next();
}

export function findProgramById(req, res, next) {
  const programId = req.params.id;
  const program = ProgramModel.findById(programId);
  if (!program) {
    return res.sendStatus(404);
  }
  req.program = program
  return next();
}