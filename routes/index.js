var express = require('express');
var router = express.Router();
var Docker = require('dockerode');
var swig = require('swig');

var docker = new Docker();
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


  //request back to test to update Image id
  // PUT /test/id

})

.post(function(req, res, next){

  var body = req.body;

  res.send(swig.renderFile('./DockerfileTemplate', body));
})
module.exports = router;
