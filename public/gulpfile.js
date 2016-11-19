var APP_SRC = ['js/*.js', 'js/**/*.js'],
    gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    util = require('gulp-util');

gulp.task('deploy', function() {
    return gulp.src(APP_SRC)
        .pipe(gp_concat('app.js'))
        .pipe(gulp.dest('.deploy'))
        .pipe(gp_rename('app.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('.deploy'));
});

gulp.task('jshint', function() {
  gulp.src(APP_SRC)
    .pipe(jshint("./config/.jshintrc"))
    .on('end', function(){ util.log('Jshint finished.'); })
    .pipe(jshint.reporter('jshint-stylish'));
});
