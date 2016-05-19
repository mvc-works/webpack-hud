
var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('compile', function() {
   gulp.src('src/**/*')
   .pipe(babel({presets: ['es2015']}))
   .pipe(gulp.dest('lib/')); 
});
