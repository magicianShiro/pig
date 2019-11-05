import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as babelTypes from '@babel/types'
import config from '../config'
import fs from 'fs'

export interface IReadFileQueue {
  rootPath?: string
  async?: number
  execuQuene?: string[]
  finish?: () => void
  everyFinish?: ({ total, current }: { total: number, current: number }) => void
}

declare module '@babel/types/lib/index' {
  export function removeComments(
    n: Node
  ): void;
}

class ReadFileQuene {
  private rootPath: string
  private async: number
  private currentyExecu: number
  public execuQuene: any[]
  private result: { [key: string]: string[] }
  private finish?: () => void
  private everyFinish?: ({ total, current }: { total: number, current: number }) => void
  public total: number
  public current: number
  private chineseReg: RegExp
  private commentReg: RegExp
  constructor(options: IReadFileQueue) {
    this.rootPath = options.rootPath || 'src'
    this.async = options.async || 5
    this.currentyExecu = this.async
    this.execuQuene = options.execuQuene || []
    this.finish = options.finish
    this.everyFinish = options.everyFinish
    this.result = {}
    this.total = 0
    this.current = 0
    this.chineseReg = /((?<=')(((?!lan|'|\)|:|}|>|=).)*|((?!'.*:).)*\\'((?!'.*:).)*)[\u4e00-\u9fa5]+(((?!'|\\'|`).)*|((?!'.*:).)*\\'((?!'|'.*:).)*)(?='))|((?<=")(((?!lan|"|\)|:|}|>|=).)*|((?!".*:).)*\\"((?!".*:).)*)[\u4e00-\u9fa5]+(((?!"|\\"|`).)*|((?!".*:).)*\\"((?!"|".*:).)*)(?="))/g
    // 前面是//注释, 后面是/** */注释
    this.commentReg = /(?<!(http:|https:|\\))\/\/.*(?=\n|\r\n)|(\s+|{)\/\*(.|\s)*?\*\//g
  }

  pushQuene(path: string) {
    this.execuQuene.push(this.readFile(path))
    this.total++
    return path
  }

  popQuene(num: number) {
    return this.execuQuene.splice(0, num)
  }
  
  readFile(path: string) {
    return () => new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) return reject(err)
        return resolve({
          path: this.rootPath + path.split(this.rootPath)[1],
          data
        })
      })
    })
  }

  async next() {
    // 执行队列为空 代表执行结束
    if(this.execuQuene.length > 0) {
      return await this.execu()
    } else {
      return this.result
    }
  }
  _getAstParseData(data: string) {
    const ast = parser.parse(data, config.babelParse)
    let chinese: string[] = []
    traverse(ast, {
      enter(path) {
        babelTypes.removeComments(path.node)
        if(path.type === 'StringLiteral') {
          const value = (path.node as any).value
          if (/[\u4e00-\u9fa5]+/g.test(value)) {
            chinese.push(value)
          }
        }
      }
    });
    return chinese
  }
  
  async execu(num = this.async): Promise<{ [key: string]: string[] }> {
    let readFilePromiseFnArr = this.popQuene(num).map(fn => fn())
    let retArr = await Promise.all(readFilePromiseFnArr)
    retArr.forEach(({ data, path }) => {
      const chinese = this._getAstParseData(data)
      if (chinese) {
        this.result[path] = chinese.filter((v: string) => v)
      }
      this.current++
    })
    this.everyFinish && this.everyFinish({ total: this.total, current: this.current })
    return this.next()
  }
}

export default ReadFileQuene