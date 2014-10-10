module.exports = {
  scripts: {
    files: [
      {
        expand: true,
        cwd: 'client/js/',
        src: ['*.js'],
        dest: 'build/js/',
        ext: '.js',
        extDot: 'first'
      }
    ]
  }
};
