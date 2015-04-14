var Docker = require('dockerode');
var swig = require('swig');
var shell = require('shelljs');
var tarGzip = require('node-targz');
var fs = require('fs');


/**
 * Builds Docker image
 * @param {Object} build   build spec
 * @param {Object} options docker options
 */

function DockerBuilder(build, options) {
  this.docker = new Docker();
  this.dockerfile = swig.renderFile('./DockerfileTemplate', build.test);
  this.build = build;
}


DockerBuilder.prototype.tarFiles = function (callback) {
  var build = this.build;
  shell.mkdir(build.TMP_DIR);

  fs.writeFile(build.DF_PATH, this.dockerfile, function (writeErr, data) {
    if (writeErr) return callback(writeErr)
    
    tarGzip.compress({
      source: build.TMP_DIR,
      destination: build.TAR_DEST,
    }, function (compressErr) {
      if (compressErr) callback(compressErr);
      else callback();
    });

  }); 
}


DockerBuilder.prototype.buildImage = function (callback) {
  var build = this.build;
  var self = this;

  this.tarFiles(function (tarError) {
    if (tarError) return callback(tarError);

    self.docker.buildImage(build.TAR_DEST, build.queryParams, function(err, res) {
      if (err) callback(err);

      shell.rm('-rf', build.TMP_DIR);
      shell.rm('-f', build.TAR_DEST);
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      
      if (err) return callback(err);

      var tag = build.queryParams.t;
      var debug = require('debug')('docker-image-builder:docker:' + tag);

      var error = null;
      var imageId;
      var data;

      function onData (raw) {
        try {
          if (!data) {
            data = JSON.parse(raw);
          }
          else {
            data += raw.toString();
            data = JSON.parse(data);
          }
        } catch (e) {
          data = raw.toString();
          return;
        }
        if (data.stream) {
          data.stream = data.stream.trim();
          var success = /Successfully built ([a-f0-9]+)/.exec(data.stream);
          if (success) {
            debug(data.stream);
            imageId = success[1];
          }
          if (/Step [0-9]+.*/.test(data.stream)) {
            debug(data.stream);
          }
        }
        else if (data.error) {
          error = data;
          debug(data.error.trim());
          if (data.errorDetail) {
            debug(data.errorDetail.message.trim());
          }
        }
        data = undefined;
      }
      function onEnd () {
        if (!error) {
          debug('done building!');
          //var data = {};
          //data[tag] = imageId;
          callback(null, imageId);
        }
        else {
          debug('done, with error. see above');
          callback(new Error('Docker Build Error: ' + error.error));
        }
      }

      res.on('data', onData);
      res.on('end', onEnd);
      
    });
  });
};



module.exports = DockerBuilder;
