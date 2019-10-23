import path from 'path'
export default {
  target: path.join(__dirname, './mock/data.js'),
  compare: path.join(__dirname, './mock/language.js'),
  extname: ['.js'],
  ignoreDir: [],
  output: {
    filename: 'language.js',
    dirpath: '/dist'
  }
};