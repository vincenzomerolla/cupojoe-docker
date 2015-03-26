var Docker = require('dockerode');

/**
 * Run command on Docker image and get output 
 * @param {Object} build   build spec
 * @param {Object} options docker options
 */
function DockerRunner(result) {
  this.docker = new Docker();
  this.result = result;
}


DockerRunner.prototype.runCommand = function (stream, callback) {
  //image id, replace publicFiles test command
  var result = this.result;
  var testId = result.test;
  var imageId = result.dockerId;
  console.log(imageId);
  var testPath ='~/test_' + testId;


  function replaceFile(file) {
    return ['echo', '\"' + file.body + '\"', '>', '.'+file.fullPath].join(' ');
  }

  var replaceFilesCommand = result.publicFiles.map(replaceFile).join(' && ');

  var command = [ ['cd ' + testPath, replaceFilesCommand , result.testCommands].join(' && ') ] ;


  this.docker.run(imageId, command, stream, function (err, data, container) {
    if (err) return callback(err);
    console.log(data, container);

  });



};



module.exports = DockerRunner;