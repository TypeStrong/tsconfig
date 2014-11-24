/// <reference path="../typings/vendor.d.ts"/>

import main = require('../lib/index');
import chai = require('chai');
import path = require('path');

var pathToTestProjects = path.resolve(path.join(__dirname, '../../testprojects/'));

describe(main.getProjectsSync.name, () => {


    var expectedProjectFileDetails: {
        testPath: string;
        expected: TypeScriptProjectFileDetails;
    }[] = [
            {
                testPath: pathToTestProjects + 'dual/src/foo.ts',
                expected: {
                    projectFilePath: '',
                    projects: []
                }
            }
        ];

    it('Expected results should match', () => {
        expectedProjectFileDetails.forEach((test) => {
            var result = main.getProjectsSync(test.testPath);
            chai.assert.deepEqual(result, test.expected);
        });
    });
});
