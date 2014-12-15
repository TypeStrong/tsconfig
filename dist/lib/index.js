var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var expand = require('glob-expand');

var projectFileName = 'tsproj.yml';

function getProjectsSync(pathOrSrcFile) {
    if (!fs.existsSync(pathOrSrcFile))
        throw new Error('Invalid Path');

    var dir = fs.lstatSync(pathOrSrcFile).isDirectory() ? pathOrSrcFile : path.dirname(pathOrSrcFile);

    var projectFilePath = '';
    while (fs.existsSync(dir)) {
        var potentialProjectFile = dir + '/' + projectFileName;
        if (fs.existsSync(potentialProjectFile)) {
            projectFilePath = potentialProjectFile;
            break;
        } else {
            var before = dir;
            dir = path.dirname(dir);

            if (dir == before)
                throw new Error('No Project Found');
        }
    }
    projectFilePath = path.normalize(projectFilePath);

    var parsedProjectSpecFile = yaml.safeLoad(fs.readFileSync(projectFilePath, 'utf8'));
    if (typeof parsedProjectSpecFile == "string")
        throw new Error("Invalid YAML");
    if (parsedProjectSpecFile.projects == void 0)
        throw new Error("The root of the YAML file must be 'projects'");

    var projectSpecs = parsedProjectSpecFile.projects;
    var projects = [];

    function runWithDefault(run, val, def) {
        if (val == void 0) {
            if (def != void 0) {
                run(def);
            }
        } else {
            run(val);
        }
    }

    Object.keys(projectSpecs).forEach(function (projectSpecName) {
        var projectSpec = projectSpecs[projectSpecName];
        var project = {};

        project.name = projectSpecName;

        var cwdPath = path.relative(process.cwd(), path.dirname(projectFilePath));
        project.expandedSources = expand({ filter: 'isFile', cwd: cwdPath }, projectSpec.sources);

        project.sources = projectSpec.sources;
        project.target = projectSpec.target || 'es5';
        project.module = projectSpec.module || 'commonjs';
        project.declaration = projectSpec.declaration == void 0 ? false : projectSpec.declaration;
        runWithDefault(function (val) {
            return project.out = val;
        }, projectSpec.out);
        runWithDefault(function (val) {
            return project.outDir = val;
        }, projectSpec.outDir);
        project.noImplicitAny = projectSpec.noImplicitAny == void 0 ? false : projectSpec.noImplicitAny;
        project.removeComments = projectSpec.removeComments == void 0 ? true : projectSpec.removeComments;
        runWithDefault(function (val) {
            return project.sourceMap = val;
        }, projectSpec.sourceMap);
        runWithDefault(function (val) {
            return project.sourceRoot = val;
        }, projectSpec.sourceRoot);
        runWithDefault(function (val) {
            return project.mapRoot = val;
        }, projectSpec.mapRoot);

        projects.push(project);
    });

    return {
        projectFilePath: projectFilePath,
        projects: projects
    };
}
exports.getProjectsSync = getProjectsSync;

function getProjectsForFileSync(path) {
    return {
        projectFilePath: '',
        projects: []
    };
}
exports.getProjectsForFileSync = getProjectsForFileSync;

function createRootProjectSync(pathOrSrcFile, spec) {
    return;
}
exports.createRootProjectSync = createRootProjectSync;
