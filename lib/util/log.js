'use strict';

var clc = require('cli-color');

module.exports = {
  info: function (name, verbose) {
    return this.log('info', name, clc.xterm(240), verbose);
  },

  debug: function (name, verbose) {
    if (verbose) {
      return this.log('debug', name, clc.cyan, verbose);
    } else {
      return function () {};
    }
  },

  error: function (name, verbose) {
    return this.log('error', name, clc.red.bold, verbose);
  },

  log: function (level, name, color, verbose) {
    return function () {
      var args   = Array.prototype.slice.call(arguments, 0);
      var prefix = color(name) + ' ';

      args.unshift(prefix);

      if (verbose) {
        args.push('(' + this.codeLoc() + ')');
      }

      console.log.apply(console, args);
    }.bind(this);
  },

  codeLoc: function () {
    var stack = new Error().stack;

    stack = stack.split('\n')[3];
    stack = stack.match(/([a-zA-Z0-9.]*:[0-9]*:[0-9]*)\)/)[1];

    return stack;
  },

  noop: function (arg) {
    return arg;
  }
};
