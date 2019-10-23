// const CustomizeSet = require('../utils/customizeSet')
import { Context } from '../utils/pick'
import CustomizeSet from '../utils/customizeSet'
import { generateNewCode } from '../utils/babelTraverse'

// function clearEmptyArrPath(arr: string[]): string[] {
//   let tempArr: string[] = []
//   for(let i = 0, l = arr.length; i < l; i++) {
//     if (arr[i].startsWith('// ')) {
//       i++
//       if(arr[i] && !arr[i].startsWith('// ')) {
//         tempArr.push(arr[i - 1], arr[i])
//       }
//       continue
//     }
//     tempArr.push(arr[i])
//   }
//   return tempArr
// }

interface ICreateParser {
  getFormatKey: (key: string) => string
  parseObjToSet: () => CustomizeSet
  parseArrToObj: (distinctArr: string[]) => { [key: string]: string[] }
}

function createParser(obj: { [key: string]: string[] }): ICreateParser {
  const keys = Object.keys(obj)
  return {
    getFormatKey(key) {
      return `// ${key}`
    },
    parseObjToSet() {
      let customizeSet = new CustomizeSet()
      keys.forEach(key => {
        customizeSet.add(this.getFormatKey(key))
        customizeSet.add(obj[key])
      })
      return customizeSet
    },
    parseArrToObj(distinctArr) {
      let prevKeyIndex = 0 
      return keys.reduce((prev: { [key: string]: string[] }, key) => {
        const index = distinctArr.indexOf(this.getFormatKey(key))
        const sliceArrByKey = distinctArr.slice(prevKeyIndex, index)
        // 删除掉去重之后的空数组的路径
        if (sliceArrByKey.length > 0) {
          prev[key] = sliceArrByKey
        }
        prevKeyIndex = index + 1
        return prev
      }, {})
    }
  }
}

// function createTemplate(template: string, type: string) {
//   const reg = new RegExp(`(.*\\s*.*)${type}((?!const)[\\s\\S])*(?<=;\\s)`, 'g')
//   return (template.match(reg) as RegExpMatchArray)[0]
// }

// 获取交集之后的所有数据
// function getOutPutStr(unionData: string[], type: string, ctx: Context): string {
//   const { compareOrigin, template, compareTemplate } = ctx
//   let finalTemplate = ''
//   if (type === 'all') {
//     finalTemplate = createTemplate(template, type)
//   } else {
//     finalTemplate = createTemplate(compareTemplate, type)
//   }
//   const reg = /(\s*.*)(['"])key(.*)value(.*)/g
//   const dateTemplate = (finalTemplate.match(reg) as RegExpMatchArray)[0]
//   const retStr = unionData.reduce((prev, data) => {
//     if (data.startsWith('// ')) {
//       prev += dateTemplate.replace(reg, `$1${data.replace(/\\/g, ' => ')}`)
//     } else {
//       prev += dateTemplate.replace(reg, `$1$2${data}$3${compareOrigin && compareOrigin[data] ? compareOrigin[data] : ''}$4`)
//     }
//     return prev
//   }, '')
//   return finalTemplate.replace(reg, retStr)
  
// }

function hasCompare(ctx: Context, chineseSet: CustomizeSet) {
  const { compareOrigin, compareOriginFile, extraTemplate, lackTemplate } = ctx
  const templateSet = new CustomizeSet({ dataStore: Object.keys(compareOrigin!) })
  // 和模板对比之后的补集(也就是模板中没有的中文部分)
  const lackDiff = templateSet.difference(chineseSet)
  
  const extraDiff = chineseSet.difference(templateSet)
  // 求交集
  // const unionArr = templateSet.union(chineseSet)
  const allData = generateNewCode(compareOriginFile!, lackDiff.getArr())
  const extraData = generateNewCode(extraTemplate, extraDiff.getArr())
  const lackData = generateNewCode(lackTemplate, lackDiff.getArr())
  return {
    allData,
    extraData,
    lackData
    // allData: getOutPutStr(clearEmptyArrPath(unionArr.getArr()), 'all', ctx),
    // extraData: getOutPutStr(clearEmptyArrPath(extraDiff.getArr()), 'extra', ctx),
    // lackData: getOutPutStr(clearEmptyArrPath(lackDiff.getArr()), 'lack', ctx)
  }
}

async function dataHandle(ctx: Context, next: any) {
  const { chineseMap, compareOrigin, allTemplate } = ctx
  const parser = createParser(chineseMap)
  // 通过parser拿到去重的中文数组
  const chineseSet = parser.parseObjToSet()
  // let outputData = getOutPutStr(clearEmptyArrPath(chineseSet.getArr()), 'all', ctx)
  let outputData = generateNewCode(allTemplate, chineseSet.getArr())
  // 是否需要对比
  if (compareOrigin) {
    const { allData, extraData, lackData } = hasCompare(ctx, chineseSet)
    outputData = allData
    ctx.compareData = extraData + '\r\n' + lackData
  }
  ctx.outputData = outputData

  await next()
}

export default dataHandle;