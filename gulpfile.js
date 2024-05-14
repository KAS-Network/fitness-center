import {src, dest, watch, series} from "gulp";
import newer from "gulp-newer";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import imagemin from "gulp-imagemin";
import concat from "gulp-concat";

const sass = gulpSass(dartSass);

export function buildServerJS() {
  return src("src/**/*.js", {ignore: "src/public/**/*.js"})
  .pipe(newer("dist"))
  .pipe(dest("dist"));
}

export function buildEjs() {
  return src("src/**/*.ejs")
  .pipe(newer("dist"))
  .pipe(dest("dist"));
}

export function buildCSS() {
  return src("src/**/*.scss", {ignore: "src/public/styles/modules/**/*.scss"})
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(dest("dist"));
}

export function buildImages() {
  return src(["src/**/*.svg", "src/**/*.jpg"], {encoding: false})
  .pipe(newer("dist"))
  .pipe(imagemin())
  .pipe(dest("dist"));
}

export function buildClientJS() {
  return src(["src/public/scripts/modules/*.js", "src/public/scripts/script.js"])
  .pipe(concat("script.js"))
  .pipe(dest("dist/public/scripts"));
}

watch("src/**/*.js", {ignored: "src/public/**/*.js"}, buildServerJS);
watch("src/**/*.ejs", buildEjs);
watch("src/**/*.scss", buildCSS);
watch(["src/**/*.svg", "src/**/*.jpg"], buildImages);
watch("src/public/scripts/**/*.js", buildClientJS);

export default series(buildServerJS, buildEjs, buildCSS, buildImages, buildClientJS);