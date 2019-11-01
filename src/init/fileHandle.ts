import fs from 'fs'
import path from 'path'
import ReadFileQuene from '../utils/readFileQuene'
import { Context } from '../utils/pig'
import { getStat } from '../utils/common'


function everyFinish({ total, current }: { total: number, current: number }): void {
  const percent = total === 0 ? 0 : current / total
  console.log(`total: ${total}, current: ${current}, 已完成 ${(percent * 100).toFixed(2)}%`)
}


function createReadFileQuene(ctx: Context) {
  const { rootPath } = ctx
  return new ReadFileQuene({
    rootPath,
    everyFinish
  })
}

// 循环文件夹下所有文件
async function loopDir (ctx: Context, dir: string, readFileQuene: ReadFileQuene): Promise<any> {
  const dirs = fs.readdirSync(dir)
  return Promise.all(dirs.map(async val => {
    return setAllFilePath(ctx, dir, val, readFileQuene)
  }))
}

async function setAllFilePath (ctx: Context, prevdir: string, name = '', readFileQuene: ReadFileQuene) {
  const { extname, ignoreDir } = ctx
  const url = path.join(prevdir, name)
  const stats = await getStat(url)
  // 该路径不存在
  if(!stats) {
    throw new Error(`path: ${url} does not exist`)
  }
  if (stats.isFile()) {
    if (extname.includes(path.extname(url))) {
      return readFileQuene.pushQuene(url)
    }
  } else if(stats.isDirectory) {
    if(!ignoreDir.includes(name)) {
      return loopDir(ctx, url, readFileQuene)
    }
  }
}

async function fileHandle(ctx: Context, next: any) {
  const { targetPath } = ctx
  const readFileQuene = createReadFileQuene(ctx)
  await setAllFilePath(ctx, targetPath, '', readFileQuene)
  const chineseMap = await readFileQuene.execu()
  ctx.chineseMap = chineseMap
  await next()
}

export default fileHandle