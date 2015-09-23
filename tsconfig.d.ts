declare module 'tsconfig' {
  export type TSConfig = {
    compilerOptions?: any;
    files?: string[];
    exclude?: string[];
    filesGlob?: string[];
  };
  /**
   * Resolve `tsconfig.json` from a directory.
   */
  export function resolve(dir: string, cb: (err: Error, filename?: string) => any): void;
  /**
   * Synchronous version of `resolve`.
   */
  export function resolveSync(dir: string): string;
  /**
   * Load `tsconfig.json` from a start directory.
   */
  export function load(dir: string, cb: (err: Error, config?: TSConfig) => any): void;
  /**
   * Synchronous version of `load`.
   */
  export function loadSync(dir: string): TSConfig;
  /**
   * Read `tsconfig.json` and parse/sanitize contents.
   */
  export function readFile(filename: string, cb: (err: Error, config?: TSConfig) => any): void;
  /**
   * Synchonrous version of `readFile`.
   */
  export function readFileSync(filename: string): TSConfig;
  /**
   * Parse a configuration file and sanitize contents.
   */
  export function parseFile(contents: string, filename: string, cb: (err: Error, config?: TSConfig) => any): void;
  /**
   * Synchronous version of `parseFile`.
   */
  export function parseFileSync(contents: string, filename: string): TSConfig;
  /**
   * Sanitize a configuration object.
   */
  export function resolveConfig(data: TSConfig, filename: string, cb: (err: Error, config?: TSConfig) => any): any;
  /**
   * Synchronous version of `resolveConfig`.
   */
  export function resolveConfigSync(data: TSConfig, filename: string): TSConfig;
}
