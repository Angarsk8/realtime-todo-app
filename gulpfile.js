const gulp   = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const babel  = require('gulp-babel')
const minCSS = require('gulp-clean-css')

const jsFiles = 'src/public/js/*.js'
const jsDest  = 'src/public/js/dist'

const cssFiles = 'src/public/css/*.css'
const cssDest  = 'src/public/css/dist'

gulp.task('build-js', () => {  
	return gulp.src(jsFiles)
		.pipe(concat('build.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(jsDest))
		.pipe(rename('build.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(jsDest))
})


gulp.task('minify-css', () => {
  return gulp.src(cssFiles)
    .pipe(minCSS({compatibility: 'ie8'}))
    .pipe(rename('build.min.css'))
    .pipe(gulp.dest(cssDest))
})

gulp.task('default', ['build-js', 'minify-css'])