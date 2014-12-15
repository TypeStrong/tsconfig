var main = require('../lib/index');
var chai = require('chai');
var path = require('path');
var pathToTestProjects = path.normalize(path.join(__dirname, '../../testprojects/'));
describe(main.getProjectsSync.name, function () {
    var expectedProjectFileDetails = [
        {
            testPath: pathToTestProjects + '/dual/src/foo.ts',
            expected: {
                projectFileDirectory: path.normalize(pathToTestProjects + '/dual/'),
                projects: [
                    {
                        "name": "web",
                        "declaration": false,
                        "expandedSources": [
                            "./src/foo.ts",
                            "./webonly/bar.ts"
                        ],
                        "module": "amd",
                        "noImplicitAny": false,
                        "removeComments": true,
                        "sources": [
                            "./src/**/*.ts",
                            "./webonly/**/*.ts"
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
                            "./src/**/*.ts",
                        ],
                        sourceMap: false,
                        "target": "es5"
                    }
                ]
            }
        },
        {
            testPath: pathToTestProjects + '/defaults/src/foo.ts',
            expected: {
                projectFileDirectory: path.normalize(pathToTestProjects + '/defaults/'),
                projects: [
                    {
                        "name": "web",
                        "declaration": false,
                        "expandedSources": [
                            "./src/foo.ts",
                        ],
                        "module": "amd",
                        "noImplicitAny": false,
                        "removeComments": true,
                        "sources": [
                            "./src/**/*.ts",
                        ],
                        sourceMap: false,
                        "target": "es5",
                    },
                ]
            }
        },
        {
            testPath: pathToTestProjects + '/rootdefaults/src/foo.ts',
            expected: {
                projectFileDirectory: path.normalize(pathToTestProjects + '/rootdefaults/'),
                projects: [
                    {
                        "name": "web",
                        "declaration": false,
                        "expandedSources": [
                            "./src/foo.ts",
                        ],
                        "module": "amd",
                        "noImplicitAny": false,
                        "removeComments": true,
                        "sources": [
                            "./src/**/*.ts",
                        ],
                        sourceMap: false,
                        "target": "es5",
                    },
                ]
            }
        },
    ];
    var failOnThese = [
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
        {
            testPath: pathToTestProjects + '/invalidfilenoprojects/src',
            expectedFailureMessage: "Project file must have a 'projects' section"
        },
    ];
    it('Expected results should match', function () {
        expectedProjectFileDetails.forEach(function (test) {
            chai.assert.deepEqual(main.getProjectsSync(test.testPath), test.expected);
        });
    });
    it('Fail gracefully', function () {
        failOnThese.forEach(function (test) {
            chai.assert.throws(function () { return main.getProjectsSync(test.testPath); }, test.expectedFailureMessage);
        });
    });
});
describe(main.getProjectsForFileSync.name, function () {
    var expectedProjectFileDetails = [
        {
            testPath: pathToTestProjects + '/dual/src/foo.ts',
            expected: {
                projectFileDirectory: path.normalize(pathToTestProjects + '/dual/'),
                projects: [
                    {
                        "name": "web",
                        "declaration": false,
                        "expandedSources": [
                            "./src/foo.ts",
                            "./webonly/bar.ts"
                        ],
                        "module": "amd",
                        "noImplicitAny": false,
                        "removeComments": true,
                        "sources": [
                            "./src/**/*.ts",
                            "./webonly/**/*.ts"
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
                            "./src/**/*.ts",
                        ],
                        sourceMap: false,
                        "target": "es5"
                    }
                ]
            }
        },
        {
            testPath: pathToTestProjects + '/dual/webonly/bar.ts',
            expected: {
                projectFileDirectory: path.normalize(pathToTestProjects + '/dual/'),
                projects: [
                    {
                        "name": "web",
                        "declaration": false,
                        "expandedSources": [
                            "./src/foo.ts",
                            "./webonly/bar.ts"
                        ],
                        "module": "amd",
                        "noImplicitAny": false,
                        "removeComments": true,
                        "sources": [
                            "./src/**/*.ts",
                            "./webonly/**/*.ts"
                        ],
                        sourceMap: false,
                        "target": "es5",
                    }
                ]
            }
        }
    ];
    it('Expected results should match', function () {
        expectedProjectFileDetails.forEach(function (test) {
            chai.assert.deepEqual(main.getProjectsForFileSync(test.testPath), test.expected);
        });
    });
});
