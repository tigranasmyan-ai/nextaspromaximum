const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const twig = require("gulp-twig");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const esbuild = require("gulp-esbuild");
const groupMediaQueries = require("gulp-group-css-media-queries");

// Paths
const paths = {
  src: {
    twig: "src/twig/**/*.twig",
    scss: "src/scss/**/*.scss",
    img: "src/img/**/*",
    js: "src/js/**/*.js",
  },
  dist: {
    html: "dist/",
    css: "dist/css",
    img: "dist/img",
    js: "dist/js",
  },
};

// Clean
function clean() {
  return del(["dist"]);
}

// Twig to HTML
function templates() {
  return gulp.src(['src/twig/pages/**/*.twig'], { base: 'src/twig/pages' })
    .pipe(twig({
      base: 'src/twig/'
    }))
    .pipe(gulp.dest(paths.dist.html))
    .pipe(browserSync.stream());
}

// SCSS to CSS (Project styles only)
function styles() {
  return gulp
    .src(['src/scss/**/*.scss', '!src/scss/vendor/**/*.scss', '!src/scss/**/_*.scss'], { base: 'src/scss' })
    .pipe(sourcemaps.init())
    .pipe(sass({ 
      quietDeps: true,
      silenceDeprecations: ['import']
    }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(groupMediaQueries())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
}

// Vendor SCSS to CSS (Bootstrap etc)
function vendorStyles() {
  return gulp
    .src(['src/scss/vendor/**/*.scss', '!src/scss/vendor/**/_*.scss'], { base: 'src/scss/vendor' })
    .pipe(sass({ 
      quietDeps: true,
      silenceDeprecations: ['import']
    }).on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist.css + "/vendor"))
    .pipe(browserSync.stream());
}

// Images
function images() {
  return gulp
    .src(paths.src.img)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ]),
    )
    .pipe(gulp.dest(paths.dist.img))
    .pipe(browserSync.stream());
}

// Scripts
function scripts() {
  return gulp
    .src(paths.src.js)
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
}

// Vendor Scripts (Bootstrap modular)
function vendorScripts() {
  return gulp
    .src("src/js/vendor/bootstrap.js")
    .pipe(esbuild({
        outfile: "bootstrap.js",
        bundle: true,
        minify: true,
        format: 'iife',
    }))
    .pipe(gulp.dest(paths.dist.js + "/vendor"))
    .pipe(browserSync.stream());
}

// Watch & Serve
function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    ghostMode: false,
    notify: false
  });
  
  // SCSS Watchers
  // Project styles: only run light styles task
  const stylesWatcher = gulp.watch(['src/scss/**/*.scss', '!src/scss/vendor/**/*.scss'], { delay: 100 }, styles);
  stylesWatcher.on('all', function(event, path) {
    console.log(`[Watcher] Project SCSS ${path} was ${event}, running styles...`);
  });

  // Vendor styles: only run heavy vendorStyles task
  const vendorStylesWatcher = gulp.watch('src/scss/vendor/**/*.scss', { delay: 500 }, vendorStyles);
  vendorStylesWatcher.on('all', function(event, path) {
    console.log(`[Watcher] Vendor SCSS ${path} was ${event}, running vendorStyles...`);
  });

  gulp.watch(paths.src.twig, templates);
  gulp.watch(paths.src.img, images);
  gulp.watch(paths.src.js, gulp.parallel(scripts, vendorScripts));
}

const build = gulp.series(
  clean,
  gulp.parallel(templates, styles, vendorStyles, images, scripts, vendorScripts),
);
const dev = gulp.series(build, watch);

exports.templates = templates;
exports.styles = styles;
exports.vendorStyles = vendorStyles;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;
exports.build = build;
exports.default = dev;
