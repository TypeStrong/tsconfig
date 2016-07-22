import { expect } from 'chai'
import { join } from 'path'
import { inspect } from 'util'
import * as tsconfig from './tsconfig'

const TEST_DIR = join(__dirname, '../tests')

interface Test {
  path: [string] | [string, string]
  result?: tsconfig.TSConfig
  error?: string
  filename?: string
}

describe('tsconfig', function () {
  const tests: Test[] = [
    {
      path: [TEST_DIR, 'invalidfile'],
      error: `Unexpected token 's' at 1:1 in ${join(TEST_DIR, 'invalidfile/tsconfig.json')}\nsome random string\n^`
    },
    {
      path: [TEST_DIR, 'missing'],
      error: 'Cannot find a tsconfig.json file at the specified directory: missing'
    },
    {
      path: [TEST_DIR, 'missing/foobar'],
      error: 'The specified path does not exist: missing/foobar'
    },
    {
      path: ['/'],
      result: {}
    },
    {
      path: [TEST_DIR, 'empty'],
      result: {}
    },
    {
      path: [TEST_DIR, 'empty/tsconfig.json'],
      result: {}
    },
    {
      path: [join(TEST_DIR, 'find/up/config')],
      result: {}
    },
    {
      path: [TEST_DIR, 'valid'],
      result: {
        compilerOptions: {
          module: 'commonjs',
          noImplicitAny: true,
          outDir: 'dist',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        },
        files: [
          './src/foo.ts'
        ]
      },
      filename: join(__dirname, '../tests/valid/tsconfig.json')
    },
    {
      path: [TEST_DIR, 'bom'],
      result: {
        compilerOptions: {
          module: 'commonjs',
          noImplicitAny: true,
          outDir: 'dist',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        },
        files: [
          './src/bom.ts'
        ]
      },
      filename: join(__dirname, '../tests/bom/tsconfig.json')
    },
    {
      path: [join(TEST_DIR, 'cwd')],
      result: {
        compilerOptions: {
          module: 'commonjs',
          noImplicitAny: true,
          outDir: 'dist',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        }
      },
      filename: join(__dirname, '../tests/cwd/tsconfig.json')
    }
  ]

  describe('sync', function () {
    tests.forEach(function (test) {
      describe(inspect(test.path), function () {
        it('should try to find config', function () {
          let result: any

          try {
            result = tsconfig.loadSync(test.path[0], test.path[1])
          } catch (err) {
            expect(err.message).to.equal(test.error)

            return
          }

          expect(result).to.deep.equal(test.result)
        })

        if (test.filename) {
          it('should resolve filename', function () {
            expect(tsconfig.resolveSync(test.path[0], test.path[1])).to.equal(test.filename)
          })
        }
      })
    })
  })

  describe('async', function () {
    tests.forEach(function (test) {
      describe(inspect(test.path), function () {
        it('should try to find config', function () {
          return tsconfig.load(test.path[0], test.path[1])
            .then(
              config => expect(config).to.deep.equal(test.result),
              error => expect(error.message).to.equal(test.error)
            )
        })

        if (test.filename) {
          it('should resolve filename', function () {
            return tsconfig.resolve(test.path[0], test.path[1])
              .then(filename => expect(filename).to.equal(test.filename))
          })
        }
      })
    })
  })
})
