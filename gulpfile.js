const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const rename = require('gulp-rename')

gulp.task('scss', function () {
  return gulp.src('./src/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('mo-vue-dnd.css'))
    .pipe(gulp.dest('./dist/'))
})
