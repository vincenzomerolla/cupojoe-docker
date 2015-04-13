var Docker = require('dockerode');

function DockerRunner(result) {
  this.docker = new Docker();
  this.result = result;
}


DockerRunner.prototype.runCommand = function (stream, callback) {
  var result = this.result;
  var testId = result.test;
  var imageId = result.dockerId;
  var testPath ='~/test_' + testId;


  function replaceFile(file) {
    return ['echo', '\"' + file.body + '\"', '>', '.'+file.fullPath].join(' ');
  }

  var replaceFilesCommand = result.publicFiles.map(replaceFile).join(' && ');

  var mongod = 'mongod --logpath /var/log/mongodb/server1.log --fork --smallfiles &> /dev/null';

  var command = ['cd ' + testPath, mongod, replaceFilesCommand , result.testCommands].join(' && ');


  this.docker.run(imageId, [command], stream, function (err, data, container) {
    if (err) return callback(err);
    container.remove(function (error, data) {
      if (error) return callback(error);
      calback(null, data)
    });
  });
});



module.exports = DockerRunner;
