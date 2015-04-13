var router = module.exports = require('express').Router();
var DockerRunner = require('../lib/DockerRunner');

router.route('/')
.post(function (req, res, next){


  console.log(req.body);
  var result = req.body;
  result.testCommands = result.testCommands.split('\n');
  
  var dockerRunner = new DockerRunner(result);

  dockerRunner.runCommand(res, function (err, output) {
    if (err) return next(err);
    console.log(output);
    //res.send(output);
  });
 

});