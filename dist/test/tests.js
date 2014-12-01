var main = require('../lib/index');
var chai = require('chai');
var path = require('path');

var pathToTestProjects = path.normalize(path.join(__dirname, '../../testprojects/'));

describe(main.getProjectsSync.name, function () {
    var expectedProjectFileDetails = [
        {
            testPath: pathToTestProjects + '/dual/src/foo.ts',
            expected: {
                projectFilePath: path.normalize(pathToTestProjects + '/dual/tsproj.yml'),
                projects: []
            }
        }
    ];

    it('Expected results should match', function () {
        expectedProjectFileDetails.forEach(function (test) {
            var result = main.getProjectsSync(test.testPath);
            chai.assert.deepEqual(result, test.expected);
        });
    });
});
