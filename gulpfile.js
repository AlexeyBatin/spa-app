var gulp = require('gulp'),
	gutil = require('gulp-util'),
	scss = require('gulp-sass'),
	browsersync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require("gulp-notify"),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache');

gulp.task('browser-sync', function () {
	browsersync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});

gulp.task('scss', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(scss({
			outputStyle: 'expand'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss({
			level: {
				1: {
					specialComments: 0
				}
			}
		})) // Opt., comment out when debugging
		.pipe(gulp.dest('app/css'))
		.pipe(browsersync.reload({
			stream: true
		}));
});

gulp.task('js', function () {
	return gulp.src([
			'app/libs/bootstrap/bootstrap.min.js',
			'app/js/common.js', // Always at the end
		])
		.pipe(concat('scripts.min.js'))
		//.pipe(uglify()) // Mifify js (opt.)
		.pipe(gulp.dest('app/js'))
		.pipe(browsersync.reload({
			stream: true
		}));
});


gulp.task('watch', ['scss', 'js', 'browser-sync'], function () {
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browsersync.reload);
});

gulp.task('img', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('docs/img'));
});

gulp.task('docs', ['img', 'scss', 'js'], function () {

	var buildCss = gulp.src('app/css/main.min.css')
		.pipe(gulp.dest('docs/css'));

	var buildJs = gulp.src('app/js/scripts.min.js')
		.pipe(gulp.dest('docs/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('docs'));

});


gulp.task('default', ['watch']);