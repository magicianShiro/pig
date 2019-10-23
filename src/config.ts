export interface Config {
  target: string;
  compare?: string;
  extname: string[];
  ignoreDir: string[];
  output: {
    filename: string;
    dirpath: string
  }
}

export default {
  target: '',
  extname: ['.js'],
  ignoreDir: [],
  output: {
    filename: 'language.js',
    dirpath: '/dist'
  }
}