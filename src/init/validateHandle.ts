import { Context } from '../utils/pick';
import path from 'path'
import * as babel from '@babel/core'
import { Config } from '../config'
import { getRootPath, readFile, writeFile, removeFile } from '../utils/common'

// 获取自定义的config文件内容
async function _getCustomConfig() {
  const pigrc = await readFile(path.join(await getRootPath(), 'pigrc.js'))
  let esmToCmj = (babel.transformSync(pigrc, {
    plugins: ['transform-es2015-modules-commonjs']
  }) as babel.BabelFileResult).code as string
  const pigrcPath = path.join(__dirname, './pigrc.js')
  // 改写写入文件中的__dirname
  esmToCmj = `var __dirname = ${JSON.stringify(await getRootPath())}; \r\n` + esmToCmj
  await writeFile(pigrcPath, esmToCmj)
  const configExport = require('./pigrc')
  await removeFile(pigrcPath)
  return configExport.default ? configExport.default : configExport
}

async function validateHandle(ctx: Context, next: any) {
  const customConfig = await _getCustomConfig()
  const config: Config = Object.assign(ctx.config, customConfig)
  if(!config.target) throw new Error('param target is required!');
  ctx.config = config
  await next()
}

export default validateHandle