'use strict';

var Vconf = require('venus-conf');
var path  = require('path');

module.exports = {
  /**
   * Create a configuration
   * @param {string} startPath The starting path to parse from. Can be a file or folder.
   */
  build: function (startPath) {
    var relativeTo = startPath || this.cwd;
    var ctx        = new Vconf();

    ctx.addStore({
      provider: 'literal',
      data: require(this.defaults)
    });

    ctx.addStore({
      provider: 'file',
      filename: '.nwrc',
      cwd: relativeTo
    });

    ctx.addStore({
      provider: 'env'
    });

    ctx.addStore({
      provider: 'argv'
    });

    return ctx;
  },

  /**
   * Current working directory. This will typically be the path from which
   * node-workspace was instantiated
   * @property {string} cwd Absolute filesystem path
   * @default
   */
  cwd: process.cwd(),

  /**
   * Default values
   * @property {object} defaults Default config values
   * @default
   */
  defaults: path.resolve(__dirname, '..', '.default_nwrc')
};
