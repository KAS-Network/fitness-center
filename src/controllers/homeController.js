import {FitnessCenter} from "../models/fitnessCenterModel.js";
import {SportHallModel} from "../models/sportHallModel.js";
import {TrainerModel} from "../models/trainerModel.js";
import {ProgramModel} from "../models/programModel.js";

export async function getMainPage(req, res) {
  const fitnessCenter = await FitnessCenter.getInfo();
  res.render("mainPage.ejs", {
    user: req.user,
    info: fitnessCenter,
    sportHallList: SportHallModel.all,
    trainerList: TrainerModel.all,
    programList: ProgramModel.all
  });
}