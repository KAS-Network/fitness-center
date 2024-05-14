import {SportHall, SportHallModel} from "../models/sportHallModel.js";
import {TrainerModel} from "../models/trainerModel.js";
import {ProgramModel} from "../models/programModel.js";
import fs from "fs";

export function getSportHallCreationPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  res.render("sportHallCreationPage.ejs", {user: req.user});
}

export async function handleSportHallCreation(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  const newSportHall = new SportHall(
    null,
    req.body.name,
    req.body.description,
    req.body.schedule,
    null
  );
  await SportHallModel.add(newSportHall);
  res.set("Object-Id", newSportHall.id).sendStatus(200);
}

export async function handleSportHallUploadImage(req, res) {
  await SportHallModel.update(req.sportHall);
  res.sendStatus(200);
}

export function getSportHallEditingPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  res.render("sportHallEditingPage.ejs", {user: req.user, sportHall: req.sportHall});
}

export async function handleSportHallEditing(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  req.sportHall.name = req.body.name;
  req.sportHall.description = req.body.description;
  req.sportHall.schedule = req.body.schedule;
  await SportHallModel.update(req.sportHall);
  res.sendStatus(200);
}

export async function handleSportHallDeleting(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  try {
    fs.unlinkSync(`dist/public${req.sportHall.imgURL}`);
  } catch (err) {
    
  }
  await SportHallModel.remove(req.sportHall);
  res.sendStatus(200);
}

export function getSportHallDetailedPage(req, res) {
  const programList = ProgramModel.all.filter(el => el.sportHallId === req.sportHall.id);
  const trainerList = TrainerModel.all.filter(el => programList.map(program => program.trainerId).includes(el.id));
  res.render("sportHallDetailedPage.ejs", {
    user: req.user,
    sportHall: req.sportHall,
    trainerList,
    programList
  });
}