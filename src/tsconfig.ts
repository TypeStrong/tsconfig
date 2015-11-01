import * as fs from 'fs'
import * as path from 'path'
import glob = require('globby')
import extend = require('xtend')
import stripBom = require('strip-bom')
import parseJson = require('parse-json')
import Promise = require('pinkie-promise')
import uniq = require('array-uniq')

export interface CompilerOptions {
  [key: string]: any
}

export interface TSConfig {
  compilerOptions?: CompilerOptions
  files?: string[]
  exclude?: string[]
  filesGlob?: string[]
  [key: string]: any
}

export interface Options {
  compilerOptions?: CompilerOptions
  filterDefinitions?: boolean
  resolvePaths?: boolean
}

const CONFIG_FILENAME = 'tsconfig.json'

/**
 * Resolve `tsconfig.json` from a directory.
 */
export function resolve (dir: string): Promise<string> {
  const configFile = path.resolve(dir, CONFIG_FILENAME)

  return fileExists(configFile)
    .then(exists => {
      if (exists) {
        return configFile
      }

      const parentDir = path.dirname(dir)

      if (dir === parentDir) {
        return
      }

      return resolve(parentDir)
    })
}

/**
 * Synchronous `resolve`.
 */
export function resolveSync (dir: string): string {
  const configFile = path.resolve(dir, CONFIG_FILENAME)

  if (fileExistsSync(configFile)) {
    return configFile
  }

  const parentDir = path.dirname(dir)

  if (dir === parentDir) {
    return
  }

  return resolveSync(parentDir)
}

/**
 * Load `tsconfig.json` from a start directory.
 */
export function load (dir: string, options?: Options): Promise<TSConfig> {
  return resolve(dir)
    .then(filename => {
      if (!filename) {
        return Promise.reject(new Error('Unable to resolve config file'))
      }

      return readFile(filename, options)
    })
}

/**
 * Synchronous `load`.
 */
export function loadSync (dir: string, options?: Options): TSConfig {
  const filename = resolveSync(dir)

  if (!filename) {
    throw new Error('Unable to resolve config file')
  }

  return readFileSync(filename, options)
}

/**
 * Read `tsconfig.json` and parse/sanitize contents.
 */
export function readFile (filename: string, options?: Options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, contents) => {
      if (err) {
        return reject(err)
      }

      return resolve(parseFile(contents, filename, options))
    })
  })
}

/**
 * Synchonrous `readFile`.
 */
export function readFileSync (filename: string, options?: Options): TSConfig {
  const contents = fs.readFileSync(filename, 'utf8')

  return parseFileSync(contents, filename, options)
}

/**
 * Parse a configuration file and sanitize contents.
 */
export function parseFile (contents: string, filename: string, options?: Options): Promise<TSConfig> {
  return new Promise(resolve => {
    return resolve(resolveConfig(parseContent(contents, filename), filename, options))
  })
}

/**
 * Synchronous `parseFile`.
 */
export function parseFileSync (contents: string, filename: string, options?: Options): TSConfig {
  return resolveConfigSync(parseContent(contents, filename), filename, options)
}

/**
 * Expand a configuration object.
 */
export function resolveConfig (data: TSConfig, filename: string, options?: Options): Promise<TSConfig> {
  const filesGlob = getGlob(data)

  if (filesGlob) {
    return glob(filesGlob, globOptions(filename))
      .then(files => sanitizeConfig(data, files, filename, options))
  }

  return Promise.resolve(sanitizeConfig(data, data.files, filename, options))
}

/**
 * Synchronous `resolveConfig`.
 */
export function resolveConfigSync (data: TSConfig, filename: string, options?: Options): TSConfig {
  const filesGlob = getGlob(data)

  if (filesGlob) {
    return sanitizeConfig(data, glob.sync(filesGlob, globOptions(filename)), filename, options)
  }

  return sanitizeConfig(data, data.files, filename, options)
}

/**
 * Get a glob from tsconfig.
 */
function getGlob (data: TSConfig): string[] {
  // Ensure the `filesGlob` does not exist before using `files`.
  if (!Array.isArray(data.filesGlob) && Array.isArray(data.files)) {
    return
  }

  let pattern: string[] = []

  if (Array.isArray(data.filesGlob)) {
    pattern = data.filesGlob.slice()
  }

  if (Array.isArray(data.exclude)) {
    data.exclude.forEach(x => pattern.push(`!${x}/**`))
  }

  // If the patterns are only negative, push a match all TypeScript glob.
  if (!pattern.some(x => x.charAt(0) !== '!')) {
    pattern.unshift('**/*.ts', '**/*.tsx')
  }

  return pattern
}

/**
 * Sanitize tsconfig options.
 */
function sanitizeConfig (data: TSConfig, rawFiles: string[], filename: string, options: Options = {}): TSConfig {
  const dirname = path.dirname(filename)
  const sanitize = options.resolvePaths !== false
  const filter = options.filterDefinitions === true
  const compilerOptions = extend(options.compilerOptions, data.compilerOptions)
  const tsconfig = extend(data, { compilerOptions })

  if (rawFiles != null) {
    const files = sanitize ? resolvePaths(rawFiles, dirname) : rawFiles

    tsconfig.files = filter ? filterDefinitions(files) : files
  }

  if (data.exclude != null) {
    tsconfig.exclude = sanitize ? resolvePaths(data.exclude, dirname) : data.exclude
  }

  return tsconfig
}

/**
 * Filter for definition files.
 */
function filterDefinitions (files: string[]) {
  return Array.isArray(files) ? files.filter(x => /\.d\.ts$/.test(x)) : files
}

/**
 * Check if a file exists.
 */
function fileExists (filename: string) {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      return err ? resolve(false) : resolve(stats.isFile() || stats.isFIFO())
    })
  })
}

/**
 * Synchronously check if a file exists.
 */
function fileExistsSync (filename: string): boolean {
  try {
    const stats = fs.statSync(filename)

    return stats.isFile() || stats.isFIFO()
  } catch (e) {
    return false
  }
}

/**
 * Sanitize an array of file names to absolute paths.
 */
function resolvePaths (paths: string[], dirname: string) {
  return paths ? uniq(paths.map(x => path.resolve(dirname, x))) : undefined
}

/**
 * Get glob options with default cache.
 *
 * TODO: Remove when sindresorhus/globby#18 is resolved.
 */
function globOptions (filename: string): glob.Options {
  return {
    cache: {},
    statCache: {},
    realpathCache: {},
    symlinks: {},
    nodir: true,
    follow: true,
    cwd: path.dirname(filename)
  }
}

/**
 * Parse `tsconfig.json` file.
 */
function parseContent (contents: string, filename: string) {
  const data = stripBom(contents)

  // A tsconfig.json file is permitted to be completely empty.
  if (data === '') {
    return {}
  }

  return parseJson(data, null, filename)
}
