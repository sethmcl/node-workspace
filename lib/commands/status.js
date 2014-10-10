'use strict';

var fs = require('fs');
var clc   = require('cli-color');

module.exports = {
  /**
   * @param {NodeWorkspace} nw Context
   */
  run: function (nw) {
    nw.log.info('Workspace root:', nw.rootPath);
    nw.projects.asArray.forEach(function (project) {
      project.status().then(function (status) {
        var output = [];

        var projectColor = {
          true: clc.yellow,
          false: clc.xterm(245)
        };

        var dirtyColor = {
          true: clc.red,
          false: clc.green,
          null: clc.xterm(240)
        };

        var dirtyStr = (status.isDirty) ? 'dirty' : 'clean';

        output.push(projectColor[status.isCloned](project.name));

        if (status.isDirty !== null) {
          output.push(dirtyColor[status.isDirty](dirtyStr));
        }

        nw.log.info.apply(nw.log, output);
      });
    });
  },

  /**
   * Shown in usage()
   */
  description: 'Display workspace status'
};
