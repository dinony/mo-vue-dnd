const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const rename = require('gulp-rename')

const scssFn = (inPath, outPath, outFile) => () => {
  return gulp.src(inPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename(outFile))
    .pipe(gulp.dest(outPath))
}

gulp.task('scss:lib', scssFn('src/index.scss', 'dist/', 'mo-vue-dnd.css'))

gulp.task('scss:libdemo', scssFn('src/index.scss', 'demo/dist', 'mo-vue-dnd.css'))
gulp.task('scss:demo', scssFn('demo/src/index.scss', 'demo/dist', 'index.css'))
