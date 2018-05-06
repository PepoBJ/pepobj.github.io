'use strict';

const gulp   = require('gulp'),
	sass        = require('gulp-sass'),
	babel       = require('gulp-babel'),
	pug         = require('gulp-pug'),
	imagemin    = require('gulp-imagemin'),
	webp        = require('gulp-webp'),
	uglify      = require('gulp-uglify'),
	htmlmin     = require('gulp-htmlmin'),
	plumber     = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	postcss     = require('gulp-postcss'),
	cssnano     = require('cssnano'),
	watch       = require('gulp-watch'),
	sourcemaps  = require('gulp-sourcemaps'),
	pngcrush    = require('imagemin-pngcrush'),
	dir          = {
		dev : 'dev',
		dist: 'dist',		
		nm  : 'node_modules'
	},
	files = {
		JS : [
			`js/github-calendar.min.js`,
			`js/codigos.js`
		],
		fonts : [
			`${dir.nm}/font-awesome/fonts/*.*`
		]
	},
	opts         = {
		pug : {
			pretty : true,
			locals : {
				title : 'Robert BJ Huaman Caceres',
				uri: 'http://www.roberthuaman.com',
				files : files,
				css: 'css/estilos.css'
			}
		},
		sass : {
			outputStyle : 'expanded',
			includePaths: ['node_modules']
		},
		es6 : {
			presets : ['env']
		},
		imagemin : {
			progressive : true,
			svgoPlugins: [{removeViewBox: false}],
			use : [pngcrush()]
		},
		htmlmin: {
			collapseWhitespace: true 
		}
	},
	postcssPlugins = [
		cssnano({
			core: false,
			autoprefixer: {
				add: true,
				browsers: '> 1%, last 2 versions, Firefox ESR, Opera 12.1'
			}
		})
	],
	server = browserSync.create();

gulp.task('pug', () => {
	gulp
		.src(`${dir.dev}/pug/*.pug`)
		.pipe(pug(opts.pug))
		.pipe( htmlmin(opts.htmlmin) )
		.pipe(gulp.dest(dir.dist));
});

gulp.task('styles', () => {
	gulp
		.src(`${dir.dev}/scss/estilos.scss`)
		.pipe(sourcemaps.init({ loadMaps: true}))
		.pipe(plumber())
		.pipe(sass(opts.sass))
		.pipe(postcss(postcssPlugins))
		.pipe(sourcemaps.write('.'))		
		.pipe(gulp.dest(`${dir.dist}/css`))
		.pipe(server.stream({match: '**/*.css'}));
});

gulp.task('es6', () => {
	gulp
		.src(`${dir.dev}/es6/*.js`)
		.pipe(babel(opts.es6))
		.pipe( uglify() )
		.pipe(sourcemaps.init({ loadMaps: true }))
    	.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(`${dir.dist}/js`));
});

gulp.task('img', () => {
	gulp
		.src(`${dir.dev}/img/**/*.+(png|jpeg|jpg|gif)`)
		.pipe(imagemin(opts.imagemin))
		.pipe(gulp.dest(`${dir.dist}/img`));
});

gulp.task('webp', () => {
	gulp
		.src(`${dir.dev}/img/**/*.+(png|jpeg|jpg)`)
		.pipe(webp())
		.pipe(gulp.dest(`${dir.dist}/img/webp`));
});

gulp.task('fonts', () => {
	gulp
		.src(files.fonts)
		.pipe(gulp.dest(`${dir.dist}/fonts`));
});

gulp.task('default', ['styles', 'pug', 'es6', 'img', 'webp', 'fonts'], () => {
	server.init({
		server: {
		  baseDir: `${dir.dist}`
		}
	});

	gulp.watch(`${dir.dev}/img/**/*.+(png|jpeg|jpg|gif)`, ['img']);
	gulp.watch(`${dir.dev}/img/**/*.+(png|jpeg|jpg)`, ['webp']);
	
	watch(`${dir.dev}/scss/estilos.scss`, () => gulp.start('styles'));
	watch(`${dir.dev}/es6/*.js`, () => gulp.start('es6', server.reload) );
	watch(`${dir.dev}/pug/*.pug`, () => gulp.start('pug', server.reload) );
	watch(`${dir.dev}/img/**/*.+(png|jpeg|jpg|gif)`, () => gulp.start('img') );
	watch(`${dir.dev}/img/**/*.+(png|jpeg|jpg)`, () => gulp.start('webp') );
});