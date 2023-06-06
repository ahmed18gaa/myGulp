var gulp = require("gulp"),
  concat = require("gulp-concat"),
  autoprefixer = require("gulp-autoprefixer"),
  sass = require("gulp-sass")(require("sass")),
  pug = require("gulp-pug"),
  livereload = require("gulp-livereload"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  notify = require("gulp-notify"),
  zip = require("gulp-zip"),
  ftp = require("vinyl-ftp");

// HTML Task
gulp.task("html", function () {
  return gulp
    .src("project/index.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("dist"))
    .pipe(notify("HTML Task Done"))
    .pipe(livereload());
});

// CSS Task
gulp.task("css", function () {
  return gulp
    .src(["project/header.css", "project/content.css", "project/footer.css"])
    .pipe(autoprefixer("last 3 versions"))
    .pipe(concat("main.css"))
    .pipe(gulp.dest("dist"));
});

// JS Task
gulp.task("js", function () {
  return gulp
    .src("project/js/*.js")
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(notify("JS Task Done"))
    .pipe(livereload());
});

// SASS Task
gulp.task("sass", function () {
  return gulp
    .src("project/css/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer("last 3 versions"))
    .pipe(concat("main.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(notify("SASS & CSS Task Done"))
    .pipe(livereload());
});

// Compress Files
gulp.task("compress", function () {
  return gulp
    .src("dist/**/*.*")
    .pipe(zip("website.zip"))
    .pipe(gulp.dest("./Final Project"))
    .pipe(notify("Files Compress Task Done"));
});

// Upload Design With FTP
gulp.task("deploy", function () {
  var conn = ftp.create({
    host: "",
    user: "",
    password: "",
    parallel: 10,
  });

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp
    .src(["dist/**/*.*"], { base: ".", buffer: false })
    .pipe(conn.newer("/public_html"))
    .pipe(conn.dest("/public_html"))
    .pipe(notify("Upload Task Done"))
    .pipe(livereload());
});

// Watch Task
gulp.task("watch", function () {
  require("./server.js");
  livereload.listen();
  gulp.watch("project/**/*.pug", gulp.series("html"));
  gulp.watch("project/css/**/*.scss", gulp.series("sass"));
  gulp.watch("project/js/*.js", gulp.series("js"));
  // gulp.watch("dist/**/*.*", gulp.series("deploy"));
  // gulp.watch("dist/**/*.*", gulp.series("compress"));
});

// Default Task
gulp.task("default", gulp.series("watch"));
