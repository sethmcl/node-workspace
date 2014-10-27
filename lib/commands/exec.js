'use strict';

var Promise = require('bluebird');
var spawn   = require('child_process').spawn;

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

    this.exec(projects, 0);
  },

  /**
   * Shown in usage()
   */
  description: 'Execute shell command',

  /**
   * Try to clone a project
   */
  exec: function (projects, idx) {
    var log     = this.nw.log;
    var project = projects[idx];
    var next    = this.exec.bind(this, projects, idx + 1);
    var proc;

    if (!project) {
      log.info('All done!');
      return;
    }

    log.info(project.name, '→', 'exec');

    this
      .shell(process.argv.slice(3).join(' '), project.clonePath)
      .then(next);
  },

  /**
   * Execute shell command
   * @param {string} command
   * @param {string} cwd
   * @returns {Promise}
   */
  shell: function (command, cwd) {
    var bin  = command.split(' ')[0];
    var args = command.split(' ').slice(1);

    this.nw.log.info(bin);
    this.nw.log.info(args);

    return new Promise(function (resolve, reject) {
      var proc = spawn(bin, args, { cwd: cwd });

      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);

      proc.on('exit', function (code) {
        if (code !== 0) {
          reject(new Error('Process exit code: ' + code));
        } else {
          resolve();
        }
      });

      proc.on('error', function (err) {
        console.log(err);
        reject(err);
      });
    });
  }
};
