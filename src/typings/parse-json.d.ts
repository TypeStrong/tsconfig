declare module 'parse-json' {
  function parseJson (contents: string, reviver?: Function, filename?: string): any

  export = parseJson
}
