import {User} from "../models/userModel.js";
import sha256 from "js-sha256";
import jwt from "jsonwebtoken";

const tokenExpSeconds = 60 * 30;

export function getLoginPage(req, res) {
  res.render("loginPage.ejs");
}

export async function handleLogin(req, res) {
  const login = req.body.login;
  const password = req.body.password;
  if (!login || !password) {
    return res.redirect("/login/?authError=true");
  }
  const user = await User.getUserByLogin(login);
  if (!user) {
    return res.redirect("/login/?authError=true");
  }
  if (!sha256(password) === user.passwordHash) {
    return res.redirect("/login/?authError=true");
  }
  const token = jwt.sign({
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + tokenExpSeconds
  }, process.env.PRIVATE_KEY);
  res.cookie("token", token, {maxAge: tokenExpSeconds * 1000}).redirect("/");
}