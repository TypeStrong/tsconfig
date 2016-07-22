import * as fs from 'fs'
import * as path from 'path'
import Promise = require('any-promise')
import stripBom = require('strip-bom')
import parseJson = require('parse-json')
import stripComments = require('strip-json-comments')

export interface LoadResult {
  path?: string
  config?: any
}

const CONFIG_FILENAME = 'tsconfig.json'

/**
 * Resolve a configuration file, like `tsc`.
 */
export function resolve (cwd: string, filename?: string): Promise<string | void> {
  if (!filename) {
    return find(cwd)
  }

  const fullPath = path.join(cwd, filename)

  return stat(fullPath)
    .then<string | void>(stats => {
      if (isFile(stats)) {
        return fullPath
      }

      if (isDirectory(stats)) {
        const configFile = path.join(fullPath, CONFIG_FILENAME)

        return stat(configFile)
          .then(stats => {
            if (isFile(stats)) {
              return configFile
            }

            throw new TypeError(`Cannot find a ${CONFIG_FILENAME} file at the specified directory: ${filename}`)
          })
      }

      throw new TypeError(`The specified path does not exist: ${filename}`)
    })
}

/**
 * Synchronous `resolve`.
 */
export function resolveSync (cwd: string, filename?: string): string | void {
  if (!filename) {
    return findSync(cwd)
  }

  const fullPath = path.join(cwd, filename)
  const stats = statSync(fullPath)

  if (isFile(stats)) {
    return fullPath
  }

  if (isDirectory(stats)) {
    const configFile = path.join(fullPath, CONFIG_FILENAME)
    const stats = statSync(configFile)

    if (isFile(stats)) {
      return configFile
    }

    throw new TypeError(`Cannot find a ${CONFIG_FILENAME} file at the specified directory: ${filename}`)
  }

  throw new TypeError(`The specified path does not exist: ${filename}`)
}

/**
 * Resolve `tsconfig.json` from a directory.
 */
export function find (dir: string): Promise<string | void> {
  const configFile = path.resolve(dir, CONFIG_FILENAME)

  return stat(configFile)
    .then(stats => {
      if (isFile(stats)) {
        return configFile
      }

      const parentDir = path.dirname(dir)

      if (dir === parentDir) {
        return
      }

      return find(parentDir)
    })
}

/**
 * Synchronous `find`.
 */
export function findSync (dir: string): string | void {
  const configFile = path.resolve(dir, CONFIG_FILENAME)
  const stats = statSync(configFile)

  if (isFile(stats)) {
    return configFile
  }

  const parentDir = path.dirname(dir)

  if (dir === parentDir) {
    return
  }

  return findSync(parentDir)
}

/**
 * Resolve and load configuration file.
 */
export function load (cwd: string, filename?: string): Promise<LoadResult> {
  return resolve(cwd, filename)
    .then<LoadResult>(path => {
      if (path == null) {
        return Promise.resolve({
          config: {}
        })
      }

      return readFile(path as string).then(config => ({ config, path }))
    })
}

/**
 * Synchronous `load`.
 */
export function loadSync (cwd: string, filename?: string): LoadResult {
  const path = resolveSync(cwd, filename)

  if (path == null) {
    return {
      config: {}
    }
  }

  const config = readFileSync(path as string)

  return { path: path as string, config }
}

/**
 * Read `tsconfig.json` and parse/sanitize contents.
 */
export function readFile (filename: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, contents) => {
      if (err) {
        return reject(err)
      }

      try {
        return resolve(parse(contents, filename))
      } catch (err) {
        return reject(err)
      }
    })
  })
}

/**
 * Synchonrous `readFile`.
 */
export function readFileSync (filename: string): any {
  const contents = fs.readFileSync(filename, 'utf8')

  return parse(contents, filename)
}

/**
 * Parse `tsconfig.json` file.
 */
export function parse (contents: string, filename: string) {
  const data = stripComments(stripBom(contents))

  // A tsconfig.json file is permitted to be completely empty.
  if (/^\s*$/.test(data)) {
    return {}
  }

  return parseJson(data, null, filename)
}

/**
 * Check if a file exists.
 */
function stat (filename: string): Promise<fs.Stats | void> {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(filename, (err, stats) => {
      return err ? resolve(undefined) : resolve(stats)
    })
  })
}

/**
 * Synchronously check if a file exists.
 */
function statSync (filename: string): fs.Stats | void {
  try {
    return fs.statSync(filename)
  } catch (e) {
    return
  }
}

/**
 * Check filesystem stat is a directory.
 */
function isFile (stats: fs.Stats | void) {
  return stats ? (stats as fs.Stats).isFile() || (stats as fs.Stats).isFIFO() : false
}

/**
 * Check filesystem stat is a directory.
 */
function isDirectory (stats: fs.Stats | void) {
  return stats ? (stats as fs.Stats).isDirectory() : false
}
