# tsproj
A specification for a file format + Parser Implementation for specifying TypeScript projects

# Specification
## Configuration file format
Specify the project configuration in a `tsproj.yaml` / `tsproj.yml` or `tsproj.json` file in the root of your project. The structure will be: 

```ts
interface TypeScriptProjectSpecification {
	sources: string[];         // An array of 'minimatch` patterns to specify source files  
	
	target: string;            // 'es3'|'es5'
	module: string;            // 'amd'|'commonjs'
	
	declaration: boolean;      // Generates corresponding `.d.ts` file
	out: string;               // Concatenate and emit a single file
	outDir: string;            // Redirect output structure to this directory
	
	noImplicitAny: boolean;    // Error on inferred `any` type
	removeComments: boolean;   // Do not emit comments in output
		
	sourceMap: boolean;        // Generates SourceMaps (.map files)
	sourceRoot: string;        // Optionally specifies the location where debugger should locate TypeScript source files after deployment
	mapRoot: string;           // Optionally Specifies the location where debugger should locate map files after deployment
}

interface TypeScriptProjectRootSpecification extends TypeScriptProjectSpecification {
	projects: {
		[projectName: string]: TypeScriptProjectSpecification;
	}
}
```
*Note:* all strings are case insensitive.
*Note:* `projectName` of `.main` is not allowed. Doing this so that some other application can reserve that name for caching compilation steps for a root sources. 
*Note:* `sources` can only be on root or in the `projects` not both.

## Public API
### Interfaces
```ts
interface TypeScriptProjectSpecificationWithName{
    name:string; // project name. `.main` if the anonymous root project
}
```
### API
`getProjectSpecificationSync(pathOrSrcFile:string):TypeScriptProjectSpecificationWithName[]`
Give an src (source file or directory) goes up the directory tree to find a project specification and then returns the parsed project specification. Use this to bootstrap the UI for what the user might want to do.

`getProjectsForFileSync(path:string):TypeScriptProjectSpecificationWithName[]`
Returns all the projects that have a particular source file in its sources. Use this for getting all the potential project compilations you need to run when a file changes. 

# Contributing
Please open issues for diccussion

# Misc
## Inspirations 
https://github.com/fdecampredon/brackets-typescript and `grunt` configurations
## Why YAML
So that you can comment your project file for the next dev. 
