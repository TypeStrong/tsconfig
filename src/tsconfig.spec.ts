import { expect } from 'chai'
import { join } from 'path'
import * as tsconfig from './tsconfig'

interface Test {
  path: string
  result?: tsconfig.TSConfig
  error?: string
  filename?: string
  options?: tsconfig.Options
}

describe('tsconfig', function () {
  const tests: Test[] = [
    {
      path: join(__dirname, '../..'),
      error: 'Unable to resolve config file'
    },
    {
      path: join(__dirname, '../tests/invalidfile'),
      error: `Unexpected token 's' at 1:1 in ${join(__dirname, '../tests/invalidfile/tsconfig.json')}\nsome random string\n^`
    },
    {
      path: join(__dirname, '../tests/empty'),
      result: {
        compilerOptions: {},
        files: [
          join(__dirname, '../tests/empty/cwd.ts'),
          join(__dirname, '../tests/empty/foo/bar.ts')
        ]
      }
    },
    {
      path: join(__dirname, '../tests/valid'),
      result: {
        compilerOptions: {
          module: 'commonjs',
          noImplicitAny: true,
          out: '../../built/local/tsc.js',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        },
        files: [
          join(__dirname, '../tests/valid/src/foo.ts')
        ]
      },
      filename: join(__dirname, '../tests/valid/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/bom'),
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
          join(__dirname, '../tests/bom/src/bom.ts')
        ]
      },
      filename: join(__dirname, '../tests/bom/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/exclude'),
      result: {
        compilerOptions: {
          module: 'commonjs',
          out: '../../built/local/tsc.js'
        },
        files: [
          join(__dirname, '../tests/exclude/included/foo.ts')
        ],
        exclude: [
          join(__dirname, '../tests/exclude/excluded'),
          join(__dirname, '../tests/exclude/cwd.ts')
        ]
      },
      filename: join(__dirname, '../tests/exclude/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/cwd'),
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
          join(__dirname, '../tests/cwd/foo.d.ts'),
          join(__dirname, '../tests/cwd/foo.ts'),
          join(__dirname, '../tests/cwd/foo.tsx')
        ]
      },
      filename: join(__dirname, '../tests/cwd/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/glob'),
      result: {
        compilerOptions: {},
        files: [
          join(__dirname, '../tests/glob/src/foo.ts')
        ],
        filesGlob: ['src/**/*.ts']
      },
      filename: join(__dirname, '../tests/glob/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/glob-negation'),
      result: {
        compilerOptions: {},
        files: [
          join(__dirname, '../tests/glob-negation/src/foo.ts')
        ],
        filesGlob: ['!test/**/*']
      },
      filename: join(__dirname, '../tests/glob-negation/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/glob-multi'),
      options: {
        compilerOptions: {
          target: 'es6'
        }
      },
      result: {
        compilerOptions: {
          target: 'es6'
        },
        files: [
          join(__dirname, '../tests/glob-multi/a/foo.ts'),
          join(__dirname, '../tests/glob-multi/b/foo.ts')
        ],
        filesGlob: ['a/**/*.ts', 'b/**/*.ts']
      },
      filename: join(__dirname, '../tests/glob-multi/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/glob-positive-negative'),
      options: {
        resolvePaths: false
      },
      result: {
        compilerOptions: {
          declaration: false,
          module: 'commonjs',
          noImplicitAny: false,
          removeComments: true,
          target: 'es5'
        },
        exclude: [],
        files: [
          'foo/bar.ts'
        ],
        filesGlob: ['!foo/**/*.ts', 'foo/bar.ts']
      },
      filename: join(__dirname, '../tests/glob-positive-negative/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/mixed'),
      options: {
        filterDefinitions: true,
        resolvePaths: false
      },
      result: {
        compilerOptions: {},
        files: [
          'bar.d.ts'
        ]
      },
      filename: join(__dirname, '../tests/mixed/tsconfig.json')
    }
  ]

  describe('sync', function () {
    tests.forEach(function (test) {
      describe(test.path, function () {
        it('should try to find config', function () {
          let result: any

          try {
            result = tsconfig.loadSync(test.path, test.options)
          } catch (err) {
            expect(err.message).to.equal(test.error)

            return
          }

          expect(result).to.deep.equal(test.result)
        })

        if (test.filename) {
          it('should resolve filename', function () {
            expect(tsconfig.resolveSync(test.path)).to.equal(test.filename)
          })
        }
      })
    })
  })

  describe('async', function () {
    tests.forEach(function (test) {
      describe(test.path, function () {
        it('should try to find config', function () {
          return tsconfig.load(test.path, test.options)
            .then(
              config => expect(config).to.deep.equal(test.result),
              error => expect(error.message).to.equal(test.error)
            )
        })

        if (test.filename) {
          it('should resolve filename', function () {
            return tsconfig.resolve(test.path)
              .then(filename => expect(filename).to.equal(test.filename))
          })
        }
      })
    })
  })
})
