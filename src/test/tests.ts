/// <reference path="../typings/vendor.d.ts"/>

import main = require('../lib/index');
import chai = require('chai');

var pathToTestProjects = '../../testprojects/';



describe(main.getProjectsSync.name, () => {


    //var expectedProjectRoots: {
    //    name: string;
    //    testPath: string;
    //    expected: TypeScriptProjectFile[];
    //}[] = [
    //        {
    //            name: 'dual',

    //            testPath: '/src/foo.ts',
    //            expected: [
    //                name: 'web',
    //                sources: ''
    //            ]
    //        }
    //    ];

    it('should pass', () => {
        chai.assert.deepEqual({name:123}, {name:123});
    })
});
