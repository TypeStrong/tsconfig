# tsproj
[![Build Status](https://secure.travis-ci.org/TypeStrong/tsproj.svg?branch=master)](http://travis-ci.org/TypeStrong/tsproj)
A specification for a file format + Parser Implementation for specifying TypeScript projects

# Specification
## Configuration file format
Specify the project configuration in a `tsproj.yml` file in the root of your project. The structure will be specified using the interface `TypeScriptProjectRootSpecification`: 

```ts
interface TypeScriptProjectSpecification {
	sources?: string[];         // An array of 'minimatch` patterns to specify source files  
	
	target?: string;            // 'es3'|'es5'
	module?: string;            // 'amd'|'commonjs'
	
	declaration?: boolean;      // Generates corresponding `.d.ts` file
	out?: string;               // Concatenate and emit a single file
	outDir?: string;            // Redirect output structure to this directory
	
	noImplicitAny?: boolean;    // Error on inferred `any` type
	removeComments?: boolean;   // Do not emit comments in output
		
	sourceMap?: boolean;        // Generates SourceMaps (.map files)
	sourceRoot?: string;        // Optionally specifies the location where debugger should locate TypeScript source files after deployment
	mapRoot?: string;           // Optionally Specifies the location where debugger should locate map files after deployment
}

// Main configuration
interface TypeScriptProjectRootSpecification extends TypeScriptProjectSpecification {
	projects?: {
		[projectName: string]: TypeScriptProjectSpecification;
	}
}
```
*Note:* all strings are case insensitive.
*Note:* `projectName` of `.root` is not allowed. Doing this so that some other application can reserve that name for caching compilation steps for the root sources. 
*Note:* any property can be overridden by individual projects.

## Public API
See `index.ts`. API exists for querying the project file, querying the projects relevant for single TypeScript file and creating a new project file.

# Contributing
Please open issues for diccussion

# Misc
## Inspirations 
https://github.com/fdecampredon/brackets-typescript and `grunt` configurations
## Why YAML
So that you can comment your project file for the next dev. 
