'use strict';

var config      = require('./config');
var log         = require('./util/log');
var str         = require('./util/str');
var commands    = require('./commands');
var ProjectList = require('./ProjectList');

module.exports = NodeWorkspace;

/**
 * Core application object
 * @constructor
 * @param {object} argv - key/value hash.
 */
function NodeWorkspace(argv) {
  this.commandName = argv._[0];
  this.config      = config.build();
  this.rootPath    = this.getRootPath(this.config);
  this.log         = this.createLogs(this.config);
  this.prompt      = require('./util/prompt').prompt;
}

/**
 * Run the application
 */
NodeWorkspace.prototype.run = function () {
  var config = this.config;

  if (config.get('h') || config.get('help') || !commands.isValid(this.commandName)) {
    this.usage();
  } else {
    this.projects = new ProjectList(this);
    this.command  = commands.get(this.commandName);
    this.command.run(this);
  }
};

/**
 * Exit
 * @param {number} exitCode
 */
NodeWorkspace.prototype.exit = function (exitCode) {
  process.exit(exitCode);
};

/**
 * Handle error
 * @param {Error} err
 */
NodeWorkspace.prototype.error = function (err) {
  console.error(err.stack);
  process.exit(1);
};

/**
 * Show help
 */
NodeWorkspace.prototype.usage = function () {
  var args = [
    {
      switches: ['-h', '--help'],
      description: 'show help'
    },
    {
      switches: ['--disable-colors'],
      description: 'disable colors in output logs'
    }
  ];

  console.log('Usage: nw [command] [arguments]\n');

  // Print commands
  console.log('Commands:');
  commands.list().forEach(function (commandName) {
    console.log(str.fmt(commandName, 2, 30), commands.get(commandName).description);
    console.log();
  });

  // Print options
  console.log('Options:');
  args.forEach(function (arg) {
    console.log(str.fmt(arg.switches.join(', '), 2, 30), arg.description);
  });
};

/**
 * Get directory, where .nwrc is found
 */
NodeWorkspace.prototype.getRootPath = function (config) {
  var projects = config.getWithMeta('projects');
  var dir      = null;

  if (projects) {
    dir = projects.meta.dir;
  }

  return dir;
};

/**
 * Create logs
 * @param {object} config
 * @returns {object}
 */
NodeWorkspace.prototype.createLogs = function (config) {
  var verbose = config.get('verbose');

  return {
    info: log.info('nw', verbose),
    debug: log.debug('nw', verbose),
    error: log.error('nw', verbose)
  };
};
