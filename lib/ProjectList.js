'use strict';

var Project = require('./Project');

module.exports = ProjectList;

/**
 * @constructor
 * @param {NodeWorkspace} nw
 */
function ProjectList(nw) {
  this.nw       = nw;
  this.config   = nw.config;
  this.command  = nw.command;
  this.projects = this.loadProjects(this.config.get('projects'));

  this.defineProperties();
}

/**
 * Instantiate Project objects
 * @param {object} projects
 * @returns {object}
 */
ProjectList.prototype.loadProjects = function (projects) {
  var nw = this.nw;

  return Object
    .keys(projects)
    .map(function (key) {
      return new Project(nw, key, projects[key]);
    })
    .reduce(function (retVal, cur, idx, array) {
      retVal[cur.name] = cur;
      return retVal;
    }, {});
};

/**
 * Define properties
 */
ProjectList.prototype.defineProperties = function () {
  Object.defineProperties(this, {

    /**
     * Get project list as array
     * @returns {array}
     */
    'asArray': {
      get: function () {
        return Object.keys(this.projects).map(function (key) {
          return this.projects[key];
        }, this);
      }
    }
  });
};
