'use strict';

const gulp   	 = require('gulp'),
	pug          = require('gulp-pug'),
	sass         = require('gulp-sass'),
	babel        = require('gulp-babel'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	webp         = require('gulp-webp'),
	useref       = require('gulp-useref'),
	concat       = require('gulp-concat'),
	uncss        = require('gulp-uncss'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS     = require('gulp-clean-css'),
	uglify       = require('gulp-uglify'),
	htmlmin      = require('gulp-htmlmin'),
	dir          = {
		dev : 'dev',
		dist : 'dist',		
		nm : 'node_modules'
	},
	files = {
		CSS : [
			`${dir.nm}/font-awesome/css/font-awesome.min.css`,
			`${dir.nm}/ed-grid/css/ed-grid.min.css`,
			`${dir.dist}/css/github-calendar.css`,
			`${dir.dist}/css/github-calendar-responsive.css`,
			`${dir.dist}/css/estilos.css`
		],
		mCSS : 'estilos.min.css',
		JS : [
			`${dir.dist}/js/github-calendar.min.js`,
			`${dir.dist}/js/codigos.js`
		],
		mJS : 'codigos.min.js',
		fonts : [
			`${dir.nm}/font-awesome/fonts/*.*`
		]
	},
	opts         = {
		pug : {
			pretty : true,
			locals : {
				title : 'Robert BJ Huaman Caceres',
				uri: 'https://pepobj.github.io/',
				files : files
			}
		},
		sass : {
			outputStyle : 'compressed'
		},
		es6 : {
			presets : ['es2015']
		},
		imagemin : {
			progressive : true,
			use : [pngquant()]
		},
		uncss: {
			html: [`${dir.raiz}/*.html`]
		},
		autoprefixer: {
			browsers: ['last 5 versions'],
			cascade: false
		},
		htmlmin: {
			collapseWhitespace: true 
		}
	};

gulp.task('pug', () => {
	gulp
		.src(`${dir.dev}/pug/*.pug`)
		.pipe(pug(opts.pug))
		.pipe(gulp.dest(dir.dist))
});

gulp.task('sass', () => {
	gulp
		.src(`${dir.dev}/scss/*.scss`)
		.pipe(sass(opts.sass))
		.pipe(gulp.dest(`${dir.dist}/css`));
});

gulp.task('es6', () => {
	gulp
		.src(`${dir.dev}/es6/*.js`)
		.pipe(babel(opts.es6))
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

gulp.task('css', () => {
	gulp
		.src(files.CSS)
		.pipe( concat(files.mCSS) )
		.pipe( uncss(opts.uncss) )
		.pipe( autoprefixer(opts.autoprefixer) )
		.pipe( cleanCSS() )
		.pipe( gulp.dest(`${dir.dist}/css`) );
});

gulp.task('js', () => {
	gulp
		.src( files.JS )
		.pipe( concat(files.mJS) )
		.pipe( uglify() )
		.pipe( gulp.dest(`${dir.dist}/js`) );
});

gulp.task('html', () => {
	gulp
		.src(`${dir.dist}/*.html`)
		.pipe( useref() )
		.pipe( htmlmin(opts.htmlmin) )
		.pipe( gulp.dest(dir.dist) );
});