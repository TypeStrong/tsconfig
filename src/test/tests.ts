/// <reference path="../typings/vendor.d.ts"/>
/// <reference path="../lib/interfaces.d.ts"/>

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
                    projects: [
                        {
                            "name": "web",
                            "declaration": false,
                            "expandedSources": [
                                "./src/foo.ts"
                            ],
                            "module": "amd",
                            "noImplicitAny": false,
                            "removeComments": true,
                            "sources": [
                                "./**/*.ts"
                            ],
                            sourceMap: false,
                            "target": "es5",
                        },
                        {
                            "name": "node",
                            "declaration": false,
                            "expandedSources": [
                                "./src/foo.ts"
                            ],
                            "module": "commonjs",
                            "noImplicitAny": false,
                            "removeComments": true,
                            "sources": [
                                "./**/*.ts"
                            ],
                            sourceMap: false,
                            "target": "es5"
                        }
                    ]
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
            },
            {
                testPath: pathToTestProjects + '/noproject/foo.ts',
                expectedFailureMessage: 'No Project Found'
            },
            {
                testPath: pathToTestProjects + '/invalidfile',
                expectedFailureMessage: 'Invalid YAML'
            },
            // TODO: invalid YAML : TypeError
        ];


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
