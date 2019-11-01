import fs from 'fs'
import path from 'path'

// 获取文件状态
export function getStat(path: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats);
      }
    });
  });
}
// 创建文件夹
export function mkdir(dir: string): Promise<true> {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        reject(err)
      } else {
        resolve(true);
      }
    });
  });
}
// 读取文件
export function readFile(url: string, encoding = "utf8"): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(url, encoding, (err, data) =>{
      if(err) return reject(err)
      resolve(data)
    })
  })
}
// 写入文件
export function writeFile(url: string, data: string): Promise<true> {
  return new Promise((resolve, reject) => {
    fs.writeFile(url, data, (err) => {
      if(err) return reject(err)
      resolve(true)
    })
  })
}
// 删除文件
export function removeFile(url: string): Promise<true> {
  return new Promise((resolve, reject) => {
    fs.unlink(url, (err) => {
      if(err) return reject(err)
      resolve(true)
    })
  })
}
// 读取文件列表
function _readDir(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, dirState) => {
      if(err) reject(err)
      resolve(dirState)
    }) 
  })
}
// 获取根路径
export const getRootPath = (() => {
  let root: string = ''
  return async function loop (dir = __dirname): Promise<string> {
    if (root) return root
    const dirState = await _readDir(dir)
    if (dirState.includes('pigrc.js')) {
      return root = dir
    } else {
      return loop(path.parse(dir).dir)
    }
  }
})()

// 获取实际路径
export async function getPath(url: string): Promise<string> {
  const root = await getRootPath()
  return path.join(root, url.replace(root, ''))
}