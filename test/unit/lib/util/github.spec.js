var github = hmt.lib('util', 'github');

describe('github', function () {
  var correctSsh, correctHttps, correctData;

  before(function () {
    correctSsh   = 'git@github.com:sethmcl/foo.git';
    correctHttps = 'https://github.com/sethmcl/foo.git';
    correctData  = { user: 'sethmcl', repo: 'foo' };
  });

  describe('ssh', function () {
    it('should parse partial url', function () {
      var url = github.ssh('sethmcl/foo');
      hmt.assert.equal(url, correctSsh);
    });

    it('should parse partial url with .git', function () {
      var url = github.ssh('sethmcl/foo.git');
      hmt.assert.equal(url, correctSsh);
    });

    it('should parse https url', function () {
      var url = github.ssh(correctHttps);
      hmt.assert.equal(url, correctSsh);
    });

    it('should parse ssh url', function () {
      var url = github.ssh(correctSsh);
      hmt.assert.equal(url, correctSsh);
    });
  });

  describe('https', function () {
    it('should parse partial url', function () {
      var url = github.https('sethmcl/foo');
      hmt.assert.equal(url, correctHttps);
    });

    it('should parse partial url with .git', function () {
      var url = github.https('sethmcl/foo.git');
      hmt.assert.equal(url, correctHttps);
    });

    it('should parse https url', function () {
      var url = github.https(correctHttps);
      hmt.assert.equal(url, correctHttps);
    });

    it('should parse ssh url', function () {
      var url = github.https(correctSsh);
      hmt.assert.equal(url, correctHttps);
    });
  });

  describe('normalize', function () {
    it('should normalize ssh url', function () {
      var data = github.normalize(correctSsh);
      hmt.assert.deepEqual(data, correctData);
    });

    it('should normalize https url', function () {
      var data = github.normalize(correctHttps);
      hmt.assert.deepEqual(data, correctData);
    });

    it('should normalize partial url', function () {
      var data = github.normalize('sethmcl/foo');
      hmt.assert.deepEqual(data, correctData);
    });

    it('should normalize partial url with .git', function () {
      var data = github.normalize('sethmcl/foo.git');
      hmt.assert.deepEqual(data, correctData);
    });
  });
});
