var git = hmt.lib('util', 'git');

describe('git', function () {
  describe('clone', function () {
    it('should print output', function (done) {
      git
        .clone('https://github.com/sethmcl/node-workspace.git', hmt.path('temp', 'repo'))
        .then(function () {
           done();
        }, function (err) {
           console.log('error code %s', err);
           done();
        });
    });
  });
});
