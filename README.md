# TSConfig

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Resolve and parse [`tsconfig.json`](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json), with support for `filesGlob` (array of glob strings).

## Usage

See the [TypeScript wiki](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json) for information on setting up `tsconfig.json`. Additionally, this module will parse the `filesGlob` option, if it exists.

### API

* `resolve(dir: string, cb: (err: Error, filename?: string) => any)` Aschronously resolve the location of `tsconfig.json`
* `resolveSync(dir: string): string` Synchronous version of `resolve`
* `load(dir: string, cb: (err: Error, config?: TSConfig) => any)` Resolve, load and parse `tsconfig.json` from a directory
* `loadSync(dir: string): TSConfig` Synchronous version of `load`
* `readFile(filename: string, cb: (err: Error, config?: TSConfig) => any)` Read any file as `tsconfig.json`
* `readFileSync(filename: string): TSConfig` Synchronous version of `readFile`
* `parseFile(contents: string, filename: string, cb: (err: Error, config?: TSConfig) => any)` Parse any string using TSConfig
* `parseFileSync(contents: string, filename: string): TSConfig` Synchronous version of `parseFile`
* `resolveConfig(data: TSConfig, filename: string, cb: (err: Error, config?: TSConfig) => any)` Resolve a `tsconfig.json` object against a filename (E.g. `filesGlob`)
* `resolveConfigSync(data: TSConfig, filename: string): TSConfig` Synchronous version of `resolveConfig`

## Contributing

Please open issues for discussion.

## License

MIT License

[npm-image]: https://img.shields.io/npm/v/tsconfig.svg?style=flat
[npm-url]: https://npmjs.org/package/tsconfig
[downloads-image]: https://img.shields.io/npm/dm/tsconfig.svg?style=flat
[downloads-url]: https://npmjs.org/package/tsconfig
[travis-image]: https://img.shields.io/travis/TypeStrong/tsconfig.svg?style=flat
[travis-url]: https://travis-ci.org/TypeStrong/tsconfig
[coveralls-image]: https://img.shields.io/coveralls/TypeStrong/tsconfig.svg?style=flat
[coveralls-url]: https://coveralls.io/r/TypeStrong/tsconfig?branch=master
