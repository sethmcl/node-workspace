'use strict';

var Promise = require('bluebird');
var fs      = require('fs');
var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;

module.exports = {
  /**
   * @param {NodeWorkspace} nw Context
   */
  run: function (nw) {
    this.nw = nw;

    var projects = nw.projects.asArray;

    nw.log.debug('Reading projects from', nw.rootPath);
    if (projects.length === 0) {
      nw.log.info('No projects defined, nothing to do.');
      return;
    }

    return this.exec(projects, 0);
  },

  /**
   * Shown in usage()
   */
  description: 'Execute shell command',

  /**
   * Execute command
   */
  exec: function (projects, idx) {
    var log     = this.nw.log;
    var project = projects[idx];
    var next    = this.exec.bind(this, projects, idx + 1);
    var command = process.argv.slice(3).join(' ');
    var proc;

    if (!project) {
      log.info('All done!');
      return;
    }

    console.log();
    log.info(project.name, '→', 'exec: `' + command + '`');
    console.log('======================================================================');

    return this
      .shell(command, project.clonePath)
      .then(function (out) {
        out.split('\n').forEach(function (line) {
          console.log('   ', line);
        });
      })
      .then(next);
  },

  /**
   * Execute shell command
   * @param {string} command
   * @param {string} cwd
   * @returns {Promise}
   */
  shell: function (command, cwd) {
    return new Promise(function (resolve, reject) {

      fs.stat(cwd, function (err, stats) {
        if (err || !stats.isDirectory()) {
          resolve('<< Skipping, not a directory (' + cwd + ') >>');
          return;
        }

        exec(command, { cwd: cwd }, function (err, stdout, stderr) {
          if (err) {
            reject(err);
          } else {
            resolve(stdout);
          }
        });
      });
    });
  }
};
