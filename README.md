# 一个挑选出所有中文的工具

## HOW TO USE
> 写个 pigrc.js 配置文件 然后输入 pig

## 配置文件的说明
|字段|意思|是否可选|默认值|类型|
|--|--|--|--|--|
| target | 目标文件或文件夹 |必选| 无 |string|
| compare| 想要对比的文件 |可选| 无 | string|
|extname| 想要读取的文件后缀 |可选| `[.js]` | array |
|ignoreDir| 想要忽略掉的文件夹 |可选| 无 | array |
|output| 输出配置 |可选| { filename: 'language.js', dirpath: '/dist' }  | { filename: string, dirpath: string } |

