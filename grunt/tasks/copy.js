module.exports = {
  src: {
    files: [
      {
        expand: true,
        cwd: 'client',
        src: ['tl/**/*'],
        dest: 'build/'
      }
    ]
  }
};
