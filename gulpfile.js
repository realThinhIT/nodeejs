var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    nodemon = require('gulp-nodemon');

gulp.task('styles', function () {
  // return gulp.src('app/views/styles/**/*.scss')
  return gulp.src('app/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('app/public/styles'));
});

gulp.task('start', function () {
  nodemon({
    script: 'server-dev.js', 
    ext: 'js html scss hbs',
    env: { 'NODE_ENV': 'development' },
    tasks: ['styles'],
    ignore: [
      'node_modules/'
    ],
  })
  .on('restart', function () {
    console.log('Server restarted!')
  })
})

gulp.task('watch', function() {
  gulp.watch('app/styles/**/*.scss', ['styles']);
});

gulp.task('default', [], function() {
  gulp.start('start');
});