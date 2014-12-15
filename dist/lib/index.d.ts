/// <reference path="../../src/typings/vendor.d.ts" />
/// <reference path="../../src/lib/interfaces.d.ts" />
export declare function getProjectsSync(pathOrSrcFile: string): TypeScriptProjectFileDetails;
export declare function getProjectsForFileSync(file: string): TypeScriptProjectFileDetails;
export declare function createRootProjectSync(pathOrSrcFile: any, spec?: TypeScriptProjectSpecification): void;
