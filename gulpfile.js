var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var csso = require("gulp-csso");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
const gulpNewer = require("gulp-newer");

// Gulp task to minify CSS files
gulp.task("styles", function(done) {
  return (
    gulp
      .src(["./assets/sass/*.scss", "./assets/css/fontawesome-all.min.css"])
      // Compile SASS files
      .pipe(
        sass({
          outputStyle: "nested",
          precision: 10,
          includePaths: ["."],
          onError: console.error.bind(console, "Sass error:")
        })
      )
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(gulp.dest("./docs/assets/css"))
  );
  done();
});

// Gulp task to minify JavaScript files
gulp.task("scripts", function(done) {
  return (
    gulp
      .src("./assets/js/**/*.js")
      // Minify the file
      .pipe(uglify())
      // Output
      .pipe(gulp.dest("./docs/assets/js"))
  );
  done();
});

// Gulp task to minify HTML files
gulp.task("pages", function(done) {
  return gulp
    .src(["./index.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("./docs"));
  done();
});

gulp.task("images", function(done) {
  // Make configuration from existing HTML and CSS files
  var config = $.responsiveConfig(["docs/**/*.css", "docs/**/*.html"]);

  return (
    gulp
      .src("images/*.{png,jpeg}")
      // Use configuration
      .pipe(
        $.responsive(config, {
          width: 1024,
          errorOnEnlargement: false,
          quality: 50,
          withMetadata: false,
          compressionLevel: 7,
          max: true
        })
      )
      .pipe(gulp.dest("docs/images"))
  );
  done();
});

gulp.task("cssimages", function(done) {
  return gulp
    .src("./assets/css/images/*")
    .pipe(gulp.dest("./docs/assets/css/images"));
  done();
});

gulp.task("fonts", function(done) {
  return gulp
    .src("./assets/webfonts/*")
    .pipe(gulp.dest("./docs/assets/webfonts"));
  done();
});

// Clean output directory
gulp.task("clean", () => del(["docs"]));

exports.default = gulp.series(
  "clean",
  "scripts",
  "styles",
  "pages",
  "cssimages",
  "fonts",
  "images"
);
