function getProjectsSync(pathOrSrcFile) {
    return {
        projectFilePath: '',
        projects: []
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
