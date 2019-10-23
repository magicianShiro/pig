import fs from 'fs'
import path from 'path'
import { Context } from '../utils/pick'
import { getStat, mkdir, getPath } from '../utils/common'

async function dirExistAndMake(dir: string) {
  try {
    const stats = await getStat(dir);
    //如果该路径且不是文件，返回true
    if (stats.isDirectory()) {
      return true;
    } else if (stats.isFile()) {
      //如果该路径存在但是文件，返回false
      return false;
    }
  } catch (error) {
    // Promise.resolve(null)
    return Promise.resolve(loopCreate(dir))
  }
  
}

async function loopCreate(dir: string) {
  //拿到上级路径
  const tempDir = path.parse(dir).dir;
  try {
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExistAndMake(tempDir);
    let mkdirStatus = false;
    if (status) {
      mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
  } catch (err) {
    throw new Error(err)
  }
}

// async function getOutPutPath(dirpath: string) {
//   if(dirpath.startsWith('/')) {
//     return path.join(await getRootPath(), dirpath)
//   }
//   return dirpath
// }

function _writeFile(url: string, data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.writeFile(url, data, (err) => {
      if(err) return reject(err)
      resolve()
    })
  })
}

async function outPutHandle (ctx: Context) {
  const { output: { filename, dirpath }, outputData, compareData } = ctx
  const outPutPath = await getPath(dirpath)
  
  await dirExistAndMake(outPutPath)
  const url = path.join(outPutPath, filename)
  const compareUrl = path.join(outPutPath, 'compare.js')
  const writeFileArr = [_writeFile(url, outputData)]
  if(compareData) {
    writeFileArr.push(_writeFile(compareUrl, compareData))
  }
  await Promise.all(writeFileArr)
  console.log('写入完成');
  // let outputResult = await _writeFile(url, outputData)
  // let outputResult1 = await _writeFile(url1, compareData)
}

export default outPutHandle