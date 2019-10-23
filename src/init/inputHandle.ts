import path from 'path'
import { Context } from '../utils/pick'
import {
  getRootPath,
  readFile,
  getPath } from '../utils/common'

export default async (ctx: Context, next: any) => {
  const { config } = ctx
  const targetPath = await getPath(config.target)
  const rootPath = path.parse(targetPath).base
  let compareOrigin: { [key: string]: string } | undefined
  let compareOriginFile: string | undefined
  if (config.compare) {
    compareOrigin = require( await getPath(config.compare))
    compareOriginFile = await readFile(await getPath(config.compare))
    
  }
  // const template = await readFile(path.join(__dirname, '../../template/output.js'))
  // const compareTemplate = await readFile(path.join(__dirname, '../../template/compare.js'))
  const lackTemplate = `
  // 原文件缺少的部分
  const lack = {};
  `
  const extraTemplate = `
  // 原文件多出的部分
  const extra = {};
  `
  const allTemplate = `
  // 所有内容
  const all = {};
  `
  const extname = config.extname
  const ignoreDir = config.ignoreDir
  const output = config.output

  ctx.rootPath = rootPath
  ctx.targetPath = targetPath
  // ctx.template = template
  ctx.compareOrigin = compareOrigin
  ctx.compareOriginFile = compareOriginFile
  // ctx.compareTemplate = compareTemplate
  ctx.lackTemplate = lackTemplate
  ctx.extraTemplate = extraTemplate
  ctx.allTemplate = allTemplate
  ctx.extname = extname
  ctx.ignoreDir = ignoreDir
  ctx.output = output
  await next()
}