import express from "express";
import {homeRouter} from "./routers/homeRouter.js";
import {loginRouter} from "./routers/loginRouter.js";
import cookieParser from "cookie-parser";
import {auth} from "./controllers/middleware.js";
import {logoutRouter} from "./routers/logoutRouter.js";
import {fitnessCentersRouter} from "./routers/fitnessCentersRouter.js";
import {sportHallsRouter} from "./routers/sportHallsRouter.js";
import {trainersRouter} from "./routers/trainerRouter.js";
import {programsRouter} from "./routers/programsRouter.js";

const app = express();

app.set("views", "dist/views");
app.set("view engine", "ejs");

app.use(express.static("dist/public"));
app.use(cookieParser());
app.use(auth);

app.use("/", homeRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/fitness-centers", fitnessCentersRouter);
app.use("/sport-halls", sportHallsRouter);
app.use("/trainers", trainersRouter);
app.use("/programs", programsRouter);

app.use((err, req, res, next) => {
  console.log(err.message);
  console.log(err.stack);
  res.status(500).send(err.message);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});