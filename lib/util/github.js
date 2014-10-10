'use strict';

module.exports = {
  /**
   * Get HTTPS format of repo clone url
   * @param {string} repoUrl
   * @returns {string}
   */
  https: function (repoUrl) {
    var data = this.normalize(repoUrl);

    return [
      'https://github.com/',
      data.user,
      '/',
      data.repo,
      '.git'
    ].join('');
   },

  /**
   * Get SSH format of repo clone url
   * @param {string} repoUrl
   * @returns {string}
   */
  ssh: function (repoUrl) {
    var data = this.normalize(repoUrl);

    return [
      'git@github.com:',
      data.user,
      '/',
      data.repo,
      '.git'
    ].join('');
  },

  /**
   * Normalize url, extracting 1) github username and 2) repo name
   * @param {string} repoUrl
   * @returns {object}
   */
  normalize: function (repoUrl) {
    var parts = repoUrl.split('/').reduce(function (prev, current, idx, list) {
      if (idx >= list.length - 2) {
        prev.push(current);
      }

      return prev;
    }, []);

    if (parts[1]) {
      parts[1] = parts[1].replace('.git', '');
    }

    if (parts[0].indexOf(':') !== -1) {
      parts[0] = parts[0].split(':')[1];
    }

    return {
      user: parts[0],
      repo: parts[1]
    };
  }
};
