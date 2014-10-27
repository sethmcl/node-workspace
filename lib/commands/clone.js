'use strict';

var fs = require('fs');

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

    this.tryClone(projects, 0);
  },

  /**
   * Shown in usage()
   */
  description: 'Clone projects',

  /**
   * Try to clone a project
   */
  tryClone: function (projects, idx) {
    var log     = this.nw.log;
    var prompt  = this.nw.prompt;
    var project = projects[idx];
    var next    = this.tryClone.bind(this, projects, idx + 1);
    var abort   = this.cloneError.bind(this, project);

    if (!project) {
      log.info('All done!');
      return;
    }

    log.info(project.name);

    project.status().then(function (status) {
      if (!status.isCloned) {
        project.clone().then(next, abort);
      } else {
        prompt('Delete local copy of', project.name, 'and clone from server? (y/n)')
          .then(function (response) {
            if (response.toLowerCase() === 'y') {
              project.rmClone();
              project.clone().then(next, abort);
            } else {
              next();
            }
          });
      }
    });

  },

  /**
   * Error cloning project
   * @param {Project} project
   */
  cloneError: function (project) {
    this.nw.log.error('Unable to clone project', project.url);
  }
};
