var express = require('express');
var router = express.Router();
var Docker = require('dockerode');

var docker = new Docker();
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
 // docker.listContainers(function (err, containers) {
 //   res.json(containers);
 // });
  docker.run('ubuntu', ['bash', '-c', 'uname -a'], process.stdout, function(err, data, container){
    console.log(err, data, container);
    res.json(container);
  });

module.exports = router;
