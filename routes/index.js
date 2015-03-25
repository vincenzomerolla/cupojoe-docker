var express = require('express');
var router = express.Router();
var Docker = require('dockerode');
var swig = require('swig');
var shell = require('shelljs');
var tar = require('tar');
var fstream = require('fstream');
var fs = require('fs');


var tarGzip = require('node-targz');

var dirDest = fs.createWriteStream('archive.tar')


function onError(err) {
  console.error('An error occurred:', err)
}

function onEnd() {
  console.log('Packed!')
}



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

  var test = req.body;
  var dockerfile = swig.renderFile('./DockerfileTemplate', test);
  shell.mkdir('tmp');
  dockerfile.to('tmp/Dockerfile');

  // var packer = tar.Pack({ noProprietary: true })
  //   .on('error', onError)
  //   .on('end', onEnd);

  // var reader = fstream.Reader({ path: 'tmp', type: 'Directory' });
  
  // reader.on('error', onError)
  // reader.on('end', function (){  
  //   shell.rm('-rf', 'tmp');
    

  //   docker.buildImage('archive.tar', { t: test._id }, function(err, response) {
  //     if (err) onError(err);
  //     console.log(response);
  //     res.send(response);
  //     //shell.rm('-f', 'archive.tar');
  //   })
  // });
    
  // reader.pipe(packer).pipe(dirDest);
 
  tarGzip.compress({
    source: 'tmp',
    destination: 'archive.tar.gz',
  }, function () {
    docker.buildImage('archive.tar.gz', { t: 'cupojoe/test:' + Date.now() }, function(err, response) {
      if (err) onError(err);
      shell.rm('-rf', 'tmp');
      shell.rm('-f', 'archive.tar.gz');
      console.log(JSON.parse(response.body))
      res.send(dockerfile);
    })
    
  });

})
module.exports = router;
