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
      cwd: process.cwd(),
      showOutput: true
    });
  },

  /**
   * Get status
   */
  status: function (cwd) {
    return this.exec({
      cmd: ['git', 'status'],
      cwd: cwd,
      showOutput: false
    });
  },

  /**
   * Exec command
   * @param {object} options
   */
  exec: function (options) {
    var args       = options.cmd.slice(1);
    var command    = options.cmd[0];
    var showOutput = options.showOutput;
    var cwd        = options.cwd;
    var stdout     = [];
    var stderr     = [];

    return new Promise(function (resolve, reject) {
      var g;

      g = spawn(command, args, { cwd: cwd });

      g.stdout.on('data', function (data) {
        stdout = stdout.concat(data.toString().split('\n'));

        if (showOutput) {
          console.log(data.toString());
        }
      });

      g.stderr.on('data', function (data) {
        stderr = stderr.concat(data.toString().split('\n'));

        if (showOutput) {
          console.log(data.toString());
        }
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
        console.log(err);
        reject(err);
      });
    });
  }
};
