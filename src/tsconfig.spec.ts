import { expect } from 'chai'
import { join } from 'path'
import { inspect } from 'util'
import * as tsconfig from './tsconfig'

const TEST_DIR = join(__dirname, '../tests')

interface Test {
  args: [string] | [string, string]
  config?: any
  path?: string
  error?: string
}

describe('tsconfig', function () {
  const tests: Test[] = [
    {
      args: [TEST_DIR, 'invalidfile'],
      error: parseInt(process.versions.node, 10) > 5 ? 'Unexpected token s in JSON at position 0' : 'Unexpected token s'
    },
    {
      args: [TEST_DIR, 'missing'],
      error: 'Cannot find a tsconfig.json file at the specified directory: missing'
    },
    {
      args: [TEST_DIR, 'missing/foobar'],
      error: 'The specified path does not exist: missing/foobar'
    },
    {
      args: ['/'],
      config: {
        files: [],
        compilerOptions: {}
      }
    },
    {
      args: [TEST_DIR, 'empty'],
      config: {},
      path: join(TEST_DIR, 'empty/tsconfig.json')
    },
    {
      args: [TEST_DIR, 'empty/tsconfig.json'],
      config: {},
      path: join(TEST_DIR, 'empty/tsconfig.json')
    },
    {
      args: [join(TEST_DIR, 'find/up/config')],
      config: {},
      path: join(TEST_DIR, 'find/tsconfig.json')
    },
    {
      args: [TEST_DIR, 'valid'],
      config: {
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
      path: join(TEST_DIR, 'valid/tsconfig.json')
    },
    {
      args: [TEST_DIR, 'bom'],
      config: {
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
      path: join(TEST_DIR, 'bom/tsconfig.json')
    },
    {
      args: [join(TEST_DIR, 'cwd')],
      config: {
        compilerOptions: {
          module: 'commonjs',
          noImplicitAny: true,
          outDir: 'dist',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        }
      },
      path: join(TEST_DIR, 'cwd/tsconfig.json')
    },
    {
      args: [TEST_DIR, 'extends/tsconfig-third.json'],
      config: {
        compilerOptions: {
          module: 'commonjs',
          noImplicitAny: true,
          outDir: 'dist-third',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true,
          rootDirs: [
            'src',
            'test'
          ]
        },
        files: [
          './src/bar.ts'
        ]
      },
      path: join(TEST_DIR, 'extends/tsconfig-third.json')
    }
  ]

  describe('sync', function () {
    tests.forEach(function (test) {
      describe(inspect(test.args), function () {
        it('should try to find config', function () {
          let result: any

          try {
            result = tsconfig.loadSync(test.args[0], test.args[1])
          } catch (err) {
            expect(err.message).to.equal(test.error)

            return
          }

          expect(result.path).to.equal(test.path)
          expect(result.config).to.deep.equal(test.config)
        })

        if (test.path) {
          it('should resolve filename', function () {
            expect(tsconfig.resolveSync(test.args[0], test.args[1])).to.equal(test.path)
          })
        }
      })
    })
  })

  describe('async', function () {
    tests.forEach(function (test) {
      describe(inspect(test.args), function () {
        it('should try to find config', function () {
          return tsconfig.load(test.args[0], test.args[1])
            .then(
              result => {
                expect(result.path).to.equal(test.path)
                expect(result.config).to.deep.equal(test.config)
              },
              error => {
                expect(error.message).to.equal(test.error)
              }
            )
        })

        if (test.path) {
          it('should resolve filename', function () {
            return tsconfig.resolve(test.args[0], test.args[1])
              .then(filename => {
                expect(filename).to.equal(test.path)
              })
          })
        }
      })
    })
  })
})
