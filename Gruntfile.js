module.exports = function (grunt) {
    'use strict';
    
    var srcDir = 'src';
    var outDir = 'dist';

    grunt.initConfig({
        ts: {
            options: {
                target: 'es5',
                module: 'commonjs',
                sourceMap: false,
            },
            dev: {
                src: [srcDir + '/**/*.ts'],
                outDir: outDir,
                watch: srcDir
            },
            build: {
                src: [srcDir + '/**/*.ts'],
                outDir: outDir,
            },
        },
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.registerTask('default', ['ts:dev']);
    grunt.registerTask('build', ['ts:build']);
};