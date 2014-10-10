'use strict';

var fs      = require('fs');
var rmrf    = require('rmrf');
var path    = require('path');
var github  = require('./util/github');
var git     = require('./util/git');
var Promise = require('bluebird');

module.exports = Project;

/**
 * @constructor
 * @param {NodeWorkspace} nw
 * @param {string} name
 * @param {string} data
 */
function Project(nw, name, data) {
  this.name      = name;
  this.url       = github.ssh(data);
  this.clonePath = path.resolve(nw.rootPath, nw.config.get('clonePath'), name);
  this.gitPath   = path.resolve(this.clonePath, '.git');
}

/**
 * Check if project is cloned (checked out) and exists on disk
 * @returns {boolean}
 */
Project.prototype.isCloned = function () {
  if (!fs.existsSync(this.clonePath)) {
    return false;
  }

  if (!fs.existsSync(this.gitPath)) {
    return false;
  }

  if (!fs.statSync(this.clonePath).isDirectory()) {
    return false;
  }

  if (!fs.statSync(this.gitPath).isDirectory()) {
    return false;
  }

  return true;
};

/**
 * Delete local clone
 */
Project.prototype.rmClone = function () {
  rmrf(this.clonePath);
};

/**
 * Use git to clone the project
 * @returns {Promise}
 */
Project.prototype.clone = function () {
  return git.clone(this.url, this.clonePath);
};

/**
 * Check git status of cloned project
 * @returns {Promise}
 */
Project.prototype.status = function () {
  return new Promise(function (resolve, reject) {
    var status = {
      isCloned: this.isCloned(),
      isDirty: null
    };

    if (!status.isCloned) {
      resolve(status);
      return;
    }

    git.status(this.clonePath).then(function (out) {
      var result = out.stdout[out.stdout.length - 2];

      if (result === 'nothing to commit, working directory clean') {
        status.isDirty = false;
      } else {
        status.isDirty = true;
      }

      resolve(status);
    });
  }.bind(this));
};
