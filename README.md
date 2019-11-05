# 一个挑选出所有中文的工具

## how to install
npm install zzpig --save-dev

## how to use
1. 写个 pigrc.js 配置文件
2. package.json中配置script, 举个栗子
    ```json
    "scripts": {
      "pig": "pig"
    },
    ```
3. npm run pig

## 配置文件的说明
|字段|意思|是否可选|默认值|类型|
|--|--|--|--|--|
| target | 目标文件或文件夹 |必选| 无 |string|
| compare| 想要对比的文件 |可选| 无 | string|
|extname| 想要读取的文件后缀 |可选| `[.js]` | array |
|ignoreDir| 想要忽略掉的文件夹 |可选| 无 | array |
|babelParse|babel解析ast所需的配置, 详情请看[babel-parse](https://www.babeljs.cn/docs/babel-parser)|可选| { sourceType: 'module',  plugins: ["jsx", 'classProperties', 'dynamicImport'] } | object|
|output| 输出配置, filename: 输出的文件名, dirpath: 输出的文件路径 |可选| { filename: 'language.js', dirpath: '/dist' }  | { filename: string, dirpath: string } |

