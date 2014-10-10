'use strict';

var Promise = require('bluebird');
var spawn   = require('child_process').spawn;

module.exports = {
  /**
   * Clone a repo
   */
  clone: function (url, path) {
    return this.exec({
      cmd: ['git', 'clone', url, path],
      stdout: true
    });
  },

  /**
   * Get status
   */
  status: function (cwd) {
    return this.exec({
      cmd: ['git', 'status'],
      cwd: cwd,
      stdout: false
    });
  },

  /**
   * Exec command
   * @param {object} options
   */
  exec: function (options) {
    var args       = options.cmd.slice(1);
    var command    = options.cmd[0];
    var showStdout = options.stdout;
    var cwd        = options.cwd;
    var stdout     = [];
    var stderr     = [];

    console.log('showStdout:', showStdout);

    return new Promise(function (resolve, reject) {
      var g = spawn(command, args, { cwd: cwd });

      if (showStdout) {
        g.stdout.pipe(process.stdout);
      }

      g.stdout.on('data', function (data) {
        console.log('hey hey');
        stdout = stdout.concat(data.toString().split('\n'));

        // if (showStdout) {
          console.log(data.toString());
        // }
      });

      g.stderr.on('data', function (data) {
        stderr = stderr.concat(data.toString().split('\n'));
      });

      g.on('exit', function (code) {
        if (code === 0) {
          resolve({
            stdout: stdout,
            stderr: stderr
          });
        } else {
          reject(code);
        }
      });

      g.on('error', function (err) {
        reject(err);
      });
    });
  }
};
