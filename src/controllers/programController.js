import {Program, ProgramModel} from "../models/programModel.js";
import {TrainerModel} from "../models/trainerModel.js";
import {SportHallModel} from "../models/sportHallModel.js";
import fs from "fs";

export function getProgramCreationPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  res.render("programCreationPage.ejs", {
    user: req.user,
    trainerList: TrainerModel.all,
    sportHallList: SportHallModel.all
  });
}

export async function handleProgramCreation(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  console.log(req.body);
  const newProgram = new Program(
    null,
    req.body.name,
    req.body.trainerId,
    req.body.sportHallId,
    req.body.description,
    req.body.schedule,
    null
  );
  await ProgramModel.add(newProgram);
  res.set("Object-Id", newProgram.id).sendStatus(200);
}

export async function handleProgramUploadImage(req, res) {
  await ProgramModel.update(req.program);
  res.sendStatus(200);
}

export function getProgramEditingPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  res.render("programEditingPage.ejs", {
    user: req.user,
    program: req.program,
    trainerList: TrainerModel.all,
    sportHallList: SportHallModel.all
  });
}

export async function handleProgramEditing(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  req.program.name = req.body.name;
  req.program.trainerId = req.body.trainerId,
  req.program.sportHallId = req.body.sportHallId,
  req.program.description = req.body.description;
  req.program.schedule = req.body.schedule;
  await ProgramModel.update(req.program);
  res.sendStatus(200);
}

export async function handleProgramDeleting(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  try {
    fs.unlinkSync(`dist/public${req.program.imgURL}`);
  } catch (err) {
    console.log(err.message);
  }
  await ProgramModel.remove(req.program);
  res.sendStatus(200);
}

export function getProgramDetailedPage(req, res) {
  const trainer = TrainerModel.findById(req.program.trainerId);
  const sportHall = SportHallModel.findById(req.program.sportHallId);
  res.render("programDetailedPage.ejs", {
    user: req.user,
    program: req.program,
    trainer,
    sportHall
  });
}