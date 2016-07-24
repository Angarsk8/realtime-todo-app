const gulp   = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const babel  = require('gulp-babel')
const react  = require('gulp-react')
const minCSS = require('gulp-clean-css')

const jsFiles = 'src/public/js/src/*.js'
const jsDest  = 'src/public/js/dist'

const cssFiles = 'src/public/css/src/*.css'
const cssDest  = 'src/public/css/dist'

// Front-end js libraries relative path
const jquery         = 'node_modules/jquery/dist/jquery.js'
const bootstrapjs    = 'node_modules/bootstrap/dist/js/bootstrap.js'
const jqueryValidate = 'node_modules/jquery-validation/dist/jquery.validate.js'

// Front-end css libraries relative path
const bootstrapCss      = 'node_modules/bootstrap/dist/css/bootstrap.css'
const bootstrapThemeCss = 'node_modules/bootstrap/dist/css/bootstrap-theme.css'
const animateCss        = 'src/public/css/lib/animate.css'

// gulp.task('build-js', () => {
// 	return gulp.src([jquery, bootstrapjs, jqueryValidate, jsFiles])
// 		.pipe(concat('build.js'))
// 		.pipe(babel({
// 			presets: ['es2015']
// 		}))
// 		.pipe(rename('build.min.js'))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(jsDest))
// })

gulp.task('build-js', () => {
	return gulp.src(['src/public/js/components/*.jsx'])
		.pipe(concat('build.js'))
		.pipe(react())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(jsDest))
})

gulp.task('minify-css', () => {
  return gulp.src([bootstrapCss, bootstrapThemeCss, animateCss, cssFiles])
    .pipe(concat('build.css'))
    .pipe(minCSS({compatibility: 'ie8'}))
    .pipe(rename('build.min.css'))
    .pipe(gulp.dest(cssDest))
})

gulp.task('default', ['build-js', 'minify-css'])
