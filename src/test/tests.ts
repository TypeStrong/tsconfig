/// <reference path="../typings/vendor.d.ts"/>

import main = require('../lib/index');
import chai = require('chai');
import path = require('path');

var pathToTestProjects = path.normalize(path.join(__dirname, '../../testprojects/'));

describe(main.getProjectsSync.name, () => {


    var expectedProjectFileDetails: {
        testPath: string;
        expected: TypeScriptProjectFileDetails;
    }[] = [
            {
                testPath: pathToTestProjects + '/dual/src/foo.ts',
                expected: {
                    projectFilePath: path.normalize(pathToTestProjects + '/dual/tsproj.yml'),
                    projects: []
                }
            }
        ];

    var failOnThese: {
        testPath: string;
        expectedFailureMessage: string
    }[] = [
            {
                testPath: 'some/dumb/path',
                expectedFailureMessage: 'Invalid Path'
            }
        ]

    it('Expected results should match', () => {
        expectedProjectFileDetails.forEach((test) => {
            chai.assert.deepEqual(main.getProjectsSync(test.testPath), test.expected);
        });
    });

    it('Fail gracefully', () => {
        failOnThese.forEach((test) => {
            chai.assert.throws(() => main.getProjectsSync(test.testPath), test.expectedFailureMessage);
        });
    });
});
