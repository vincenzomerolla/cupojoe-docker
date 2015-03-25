var express = require('express');
var router = express.Router();
var DockerBuilder = require('../lib/DockerBuilder')


router.route('/')
.get(function(req, res, next) {

  
  // docker.createContainer({Image: 'maccam912/meanjs:latest', Cmd: ['/bin/bash', 'cd /Development/test_first_javascript/00_hello', 'mocha .'], name: 'mean-test2'}, function (err, container) {
  //   console.log(err, container);
  //   container.exec(function (err, data) {
  //     console.log(err, data);
  //     res.json(data);
  //   });
  // });

  docker.run('5709d5b04409', ['bash', '-c', 'cd /Development/test_first_javascript/00_hello && mocha .'], res, function (err, data, container) {
    console.log(data, container);
    // res.json(data);
  });

})

.post(function(req, res, next){


  var build = {
    test: req.body,
    TMP_DIR: 'tmp',
    DF_PATH: 'tmp/Dockerfile',
    TAR_DEST: 'archive.tar.gz',
    queryParams: { 
      t: 'cupojoe/test:' + Date.now() 
    } 
  };
  
  var dockerBuilder = new DockerBuilder(build, {});

  dockerBuilder.buildImage(function (err, imageId) {
    if (err) next(err);
    res.send(imageId);
  });
 

})
module.exports = router;
