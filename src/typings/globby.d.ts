declare module 'globby' {
  function globby (pattern: string | string[], options?: globby.Options): Promise<string[]>

  module globby {
    function sync (pattern: string | string[], options?: Options): string[]

    interface Options {
      cwd?: string
      root?: string
      dot?: boolean
      nomount?: boolean
      mark?: boolean
      nosort?: boolean
      stat?: boolean
      silent?: boolean
      strict?: boolean
      sync?: boolean
      nounique?: boolean
      nonull?: boolean
      debug?: boolean
      nobrace?: boolean
      noglobstar?: boolean
      noext?: boolean
      nocase?: boolean
      nodir?: boolean
      follow?: boolean
      realpath?: boolean
      nonegate?: boolean
      nocomment?: boolean
      cache?: any
      statCache?: any
      symlinks?: any
      realpathCache?: any
    }

  }

  export = globby
}
