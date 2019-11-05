import { ParserOptions } from '@babel/parser'

export interface Config {
  target: string;
  compare?: string;
  extname: string[];
  ignoreDir: string[];
  babelParse: ParserOptions,
  output: {
    filename: string;
    dirpath: string
  }
}

export default {
  target: '',
  extname: ['.js'],
  ignoreDir: [],
  babelParse: {
    sourceType: 'module',
    plugins: ["jsx", 'classProperties', 'dynamicImport'],
  },
  output: {
    filename: 'language.js',
    dirpath: '/dist'
  }
} as Config