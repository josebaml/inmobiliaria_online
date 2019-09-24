var gulp = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var newer = require('gulp-newer');


// Uso de browserSync
gulp.task('default', function(){
    browserSync.init({
        server: "./app"
    });
    gulp.watch("./scss/**/*.scss", gulp.series("sass"));
    gulp.watch("./app/css/*.css", gulp.series("cssnano"));
    gulp.watch("./app/*.html", gulp.series("minify"));
    gulp.watch("./app/*.html").on('change', browserSync.reload);
})

// Compile sass into CSS & auto-inject into browsers with browserSync
gulp.task('sass', function(){
    return gulp.src('scss/**/*.scss')
        .pipe(plumber())
        .pipe(newer('app/css'))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false,
            grid: "autoplace"
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

gulp.task('cssnano', function(){
    return gulp.src('./app/css/*.css')
        .pipe(newer('app/dist/css'))
        .pipe(cssnano())
        .pipe(gulp.dest('app/public/css'));
});

gulp.task('imagenes', function(){
    gulp.src('./app/img/*')
        .pipe(newer('./app/dist/img'))
        .pipe(imagemin())
        .pipe(gulp.dest('./app/public/img'))
});

//gulp.task('autoprefixer', function(){
    //gulp.src('scss/**/*.scss')
        //.pipe(autoprefixer({
            //browsers: ['last 2 versions'],
            //cascade: false
        //}))
        //.pipe(gulp.dest('./app/css'))
//});

gulp.task('minify', function(){
    return gulp.src('./app/*.html')
      .pipe(newer('./app/dist'))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./app/public'));
});