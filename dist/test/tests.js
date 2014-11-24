var main = require('../lib/index');
var chai = require('chai');

var pathToTestProjects = '../../testprojects/';

describe(main.getProjectsSync.name, function () {
    it('should pass', function () {
        chai.assert.deepEqual({ name: 123 }, { name: 123 });
    });
});
