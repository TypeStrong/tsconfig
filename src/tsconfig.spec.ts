import { expect } from 'chai'
import { join } from 'path'
import * as tsconfig from './tsconfig'

interface Test {
  path: string
  result?: tsconfig.TSConfig
  error?: string
  filename?: string
}

describe('tsconfig', function () {
  const tests: Test[] = [
    {
      path: join(__dirname, '../..'),
      error: 'No config file found'
    },
    {
      path: join(__dirname, '../tests/invalidfile'),
      error: `Unexpected token 's' at 1:1 in ${join(__dirname, '../tests/invalidfile/tsconfig.json')}\nsome random string\n^`
    },
    {
      path: join(__dirname, '../tests/valid'),
      result: {
        compilerOptions: {
          target: 'es5',
          module: 'commonjs',
          declaration: false,
          noImplicitAny: true,
          out: '../../built/local/tsc.js',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        },
        files: [
          join(__dirname, '../tests/valid/src/foo.ts')
        ],
        exclude: []
      },
      filename: join(__dirname, '../tests/valid/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/bom'),
      result: {
        compilerOptions: {
          target: 'es5',
          module: 'commonjs',
          declaration: false,
          noImplicitAny: true,
          outDir: 'dist',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
        },
        files: [
          join(__dirname, '../tests/bom/src/bom.ts')
        ],
        exclude: []
      },
      filename: join(__dirname, '../tests/bom/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/exclude'),
      result: {
        compilerOptions: {
          target: 'es5',
          module: 'commonjs',
          declaration: false,
          noImplicitAny: true,
          out: '../../built/local/tsc.js',
          removeComments: true,
          sourceMap: true,
          preserveConstEnums: true
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
          target: 'es5',
          module: 'commonjs',
          declaration: false,
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
        ],
        exclude: []
      },
      filename: join(__dirname, '../tests/cwd/tsconfig.json')
    },
    {
      path: join(__dirname, '../tests/glob'),
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
          join(__dirname, '../tests/glob/src/foo.ts')
        ],
        filesGlob: ['src/**/*.ts']
      },
      filename: join(__dirname, '../tests/glob/tsconfig.json')
    }
  ]

  describe('sync', function () {
    tests.forEach(function (test) {
      describe(test.path, function () {
        it('should try to find config', function () {
          let result: any

          try {
            result = tsconfig.loadSync(test.path)
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
        it('should try to find config', function (done) {
          tsconfig.load(test.path, function (err, config) {
            if (err) {
              expect(err.message).to.equal(test.error)
            } else {
              expect(config).to.deep.equal(test.result)
            }

            return done()
          })
        })

        if (test.filename) {
          it('should resolve filename', function (done) {
            tsconfig.resolve(test.path, function (err, filename) {
              expect(filename).to.equal(test.filename)

              return done(err)
            })
          })
        }
      })
    })
  })
})
