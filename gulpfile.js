var gulp = require('gulp');
var rsync = require('gulp-rsync');
var packageJson = require('./package.json');
var config = require('./config');

gulp.task('deploy', function() {
  var rsyncConfig = config.rsync;
  return gulp.src(['**/*.*','!node_modules/**'])
    .pipe(rsync({
      progress: true,
      username: rsyncConfig.username,
      hostname: rsyncConfig.hostname,
      destination: rsyncConfig.destination
    }));
})

gulp.task('watch', function() {
  gulp.watch('**', ['deploy']);
});

gulp.task('default', ['watch']);