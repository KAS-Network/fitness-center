import {Trainer, TrainerModel} from "../models/trainerModel.js";
import {SportHallModel} from "../models/sportHallModel.js";
import {ProgramModel} from "../models/programModel.js";
import fs from "fs";

export function getTrainerCreationPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  res.render("trainerCreationPage.ejs", {user: req.user});
}

export async function handleTrainerCreation(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }

  let birthdate;
  try {
    birthdate = new Date(Date.parse(req.body.birthdate));
  } catch (err) {
    birthdate = new Date();
  }

  const newTrainer = new Trainer(
    null,
    req.body.lastName,
    req.body.firstName,
    req.body.patronymic,
    birthdate,
    req.body.gender,
    req.body.description,
    req.body.schedule,
    null
  );
  await TrainerModel.add(newTrainer);
  res.set("Object-Id", newTrainer.id).sendStatus(200);
}

export async function handleTrainerUploadImage(req, res) {
  await TrainerModel.update(req.trainer);
  res.sendStatus(200);
}

export function getTrainerEditingPage(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  res.render("trainerEditingPage.ejs", {user: req.user, trainer: req.trainer});
}

export async function handleTrainerEditing(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }

  let birthdate;
  try {
    birthdate = new Date(Date.parse(req.body.birthdate));
  } catch (err) {
    birthdate = new Date();
  }

  req.trainer.lastName = req.body.lastName;
  req.trainer.firstName = req.body.firstName;
  req.trainer.patronymic = req.body.patronymic;
  req.trainer.birthdate = birthdate;
  req.trainer.gender = req.body.gender;
  req.trainer.description = req.body.description;
  req.trainer.schedule = req.body.schedule;
  await TrainerModel.update(req.trainer);
  res.sendStatus(200);
}

export async function handleTrainerDeleting(req, res) {
  if (!req.user || req.user.roleId !== 1) {
    return res.redirect("/");
  }
  await TrainerModel.remove(req.trainer);
  try {
    fs.unlinkSync(`dist/public${req.trainer.imgURL}`);
  } catch (err) {
    console.log(err.message);
  }
  res.sendStatus(200);
}

export function getTrainerDetailedPage(req, res) {
  const programList = ProgramModel.all.filter(el => el.trainerId === req.trainer.id);
  const sportHallList = SportHallModel.all.filter(el => programList.map(program => program.sportHallId).includes(el.id));
  res.render("trainerDetailedPage.ejs", {
    user: req.user,
    trainer: req.trainer,
    sportHallList,
    programList
  });
}