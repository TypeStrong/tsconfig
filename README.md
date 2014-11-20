# tsproj
A specification for a file format + Parser Implementation for specifying TypeScript projects

# Contributing
Please open issues for diccussion

# Specification
Specify the project configuration in a `tsproj.yaml` / `tsproj.yml` or `tsproj.json` file in the root of your project. The structure will be: 

```ts
interface TypeScriptProjectSpecification {
	sources: string[];
	target: string; // 'es3'|'es5'
	module: string; // 'amd'|'commonjs'
	declaration: boolean;
	out: string;
	outDir: string;
}

interface TypeScriptProjectRootSpecification extends TypeScriptProjectSpecification {
	projects: {
		[projectName: string]: TypeScriptProjectSpecification;
	}
}
```
*Note:* all strings are case insensitive.
*Note:* `projectName` of `.main` is not allowed. Doing this so that some other application can reserve that name for caching compilation steps for a root sources. 

# Misc
## Inspirations 
https://github.com/fdecampredon/brackets-typescript and `grunt` configurations
## Why YAML
So that you can comment your project file for the next dev. 
