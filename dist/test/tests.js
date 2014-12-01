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

    var failOnThese = [
        {
            testPath: 'some/dumb/path',
            expectedFailureMessage: 'Invalid Path'
        }
    ];

    it('Expected results should match', function () {
        expectedProjectFileDetails.forEach(function (test) {
            chai.assert.deepEqual(main.getProjectsSync(test.testPath), test.expected);
        });
    });

    it('Fail gracefully', function () {
        failOnThese.forEach(function (test) {
            chai.assert.throws(function () {
                return main.getProjectsSync(test.testPath);
            }, test.expectedFailureMessage);
        });
    });
});
