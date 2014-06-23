var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('uglify', function() {
  gulp.src('rgbaster.js')
    .pipe(uglify())
    .pipe(rename("rgbaster.min.js"))
    .pipe(gulp.dest('.'));
});
