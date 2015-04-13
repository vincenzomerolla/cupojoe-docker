var express = require('express');
var router = module.exports = express.Router();
var DockerBuilder = require('../lib/DockerBuilder')


router.route('/')
.post(function (req, res, next){
  var test = req.body;
  test.shellCommands = test.shellCommands.split('\n');  

  var build = {
    test: test,
    TMP_DIR: 'tmp',
    DF_PATH: 'tmp/Dockerfile',
    TAR_DEST: 'archive.tar.gz',
    queryParams: { 
      t: 'cupojoe/test:' + Date.now() 
    } 
  };
  
  var dockerBuilder = new DockerBuilder(build, {});

  dockerBuilder.buildImage(function (err, imageId) {
    if (err) return next(err);
    res.send(imageId);
  });
});



router.route('/:id')
.delete(function (req, res, next) {
  var docker = new Docker();
  var image = docker.getImage(req.params.id);
  image.remove({}, function (err, data) {
    if (err) return next(err);
    res.send(data);
  })
});
