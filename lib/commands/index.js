var requireDir = require('require-dir');
var commands   = requireDir('./');

module.exports = {
  /**
   * Check if command is valid
   * @param {string} commandName
   */
  isValid: function (commandName) {
    var name = this.normalizeName(commandName);
    return !!commands[name];
  },

  /**
   * Get array of command names
   * @returns {array}
   */
  list: function () {
    return Object.keys(commands);
  },

  /**
   * Get command by name
   * @param {string} commandName
   * @returns {object} command
   */
  get: function (commandName) {
    var name = this.normalizeName(commandName);
    return commands[name];
  },

  /**
   * Normalize command name
   * @param {string} commandName
   * @returns {string}
   */
  normalizeName: function (commandName) {
    if (typeof commandName === 'string') {
      return commandName.toLowerCase();
    }

    return commandName;
  }
};
