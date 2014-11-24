/// <reference path="../typings/vendor.d.ts"/>
/// <reference path="./interfaces.d.ts"/>

import fs = require("fs");

/** Given an src (source file or directory) goes up the directory tree to find all the project specifications that are impacted and then returns the parsed project specification. Use this to bootstrap the UI for what the user might want to do. */
export function getProjectsSync(pathOrSrcFile: string): TypeScriptProjectFileDetails {
    return {
        projectFilePath: '',
        projects: []
    };
}

/** Returns all the projects that have a particular source file in its sources. Use this for getting all the potential project compilations you need to run when a file changes. */
export function getProjectsForFileSync(path: string): TypeScriptProjectFileDetails {
    return {
        projectFilePath: '',
        projects: []
    };
}

/** Creates a project at the specified path (or source file location). Defaults are assumed unless overriden by the optional spec. */
export function createRootProjectSync(pathOrSrcFile, spec?: TypeScriptProjectSpecification) {
    return;
}