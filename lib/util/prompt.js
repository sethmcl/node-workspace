'use strict';

var clc = require('cli-color');
var readline = require('readline');
var Promise = require('bluebird');

module.exports = {
  prompt: function () {
    var question = Array.prototype.slice.call(arguments, 0).join(' ');

    return new Promise(function (resolve, reject) {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.on('line', function (line) {
        resolve(line);
        rl.close();
      });

      console.log(question);
      rl.setPrompt('> ', 2);
      rl.prompt();
    });
  }
};
