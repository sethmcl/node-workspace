'use strict';

var Promise = require('bluebird');
var mkdirp  = require('mkdirp');
var rmrf    = require('rmrf');
var fs      = require('fs');
var path    = require('path');
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

    return this.ln(projects, 0);
  },

  /**
   * Shown in usage()
   */
  description: 'Link node projects',

  /**
   * Create symbolic links
   */
  ln: function (projects, idx) {
    var log     = this.nw.log;
    var project = projects[idx];
    var next    = this.ln.bind(this, projects, idx + 1);
    var command = process.argv.slice(3).join(' ');
    var proc;

    if (!project) {
      log.info('All done!');
      return;
    }

    if (project.isCloned()) {
      log.info(project.name, '→', 'linking node modules');
      return this.linkToOthers(project, projects).then(next);
    }

    return next();
  },

  /**
   * Link a project to other projects
   */
  linkToOthers: function (project, projects) {
    return Promise.all(projects
      .filter(function (p) {
        return p !== project && p.isCloned();
      })
      .map(function (p) {
        var modulePath = path.resolve(project.nodeModulesPath, p.name);

        if (!fs.existsSync(project.nodeModulesPath)) {
          mkdirp.sync(project.nodeModulesPath);
        }

        if (fs.existsSync(modulePath)) {
          rmrf(modulePath);
        }

        return this.symlink(p.clonePath, modulePath);
      }.bind(this)));
  },

  /**
   * Create symlink
   * @param {string} srcpath
   * @param {string} dstpath
   * @returns {Promise}
   */
  symlink: function (srcpath, dstpath) {
    return new Promise(function (resolve, reject) {
      fs.symlink(srcpath, dstpath, function (err, stats) {
        if (err) {
          console.log(err);
        }

        resolve();
      });
    });
  }
};
