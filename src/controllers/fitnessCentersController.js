import {FitnessCenter} from "../models/fitnessCenterModel.js";

export async function getFitnessCenterEditingPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  const fitnessCenter = await FitnessCenter.getInfo();
  res.render("fitnessCenterEditingPage.ejs", {user: req.user, info: fitnessCenter});
}

export async function handleFitnessCenterEditing(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.sendStatus(401);
  }
  let fitnessCenter = await FitnessCenter.getInfo();
  for (let key of Object.keys(req.body)) {
    fitnessCenter[key] = req.body[key];
  }
  FitnessCenter.save();
  res.sendStatus(200);
}

export function handleFitnessCenterUploadImage(req, res) {
  res.sendStatus(200);
}