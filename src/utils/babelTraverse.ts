import * as parser from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'

type Comment = {
  type: string,
  value: string
}

type NodeCommentObj = {
  [commentKey: string]: t.ObjectProperty[]
}

declare module 'babel__traverse/index' {
  interface NodePath<T = Node> {
    pushContainer: (liskKey: string, node: t.ObjectProperty | t.ObjectProperty[]) => void,
    leadingComments: any
  }
}

declare module 'babel__generator/index' {
  interface GeneratorOptions {
    jsescOption: {
      minimal: boolean
    }
  }
}

// function _createNode(propertiesArr: string[]): t.ObjectProperty[] {
//   const nodeArr: t.ObjectProperty[] = [];
//   for(let i = 0, l = propertiesArr.length; i < l; i++) {
//     const currentData = propertiesArr[i]
//     const prevData = propertiesArr[i - 1]
//     let node: t.ObjectProperty 
//     if(currentData.startsWith('// ')) {
//       continue
//     } else {
//       node = t.objectProperty(t.stringLiteral(currentData), t.stringLiteral(''))
//     }
//     if(prevData && prevData.startsWith('// ')) {
//       const comment: Comment = {
//         type: "CommentLine",
//         value: prevData.replace('//', '').replace(/\\/g, ' => '),
//       };
//       node.leadingComments = node.leadingComments || []
//       ;(node.leadingComments as any).push(comment)
//     }
//     nodeArr.push(node)
//   }
//   return nodeArr
// }

function _createNodeObj(propertiesArr: string[]): NodeCommentObj {
  const nodeObj: NodeCommentObj = { noComment: [] }
  const commentKeyArr: string[] = []
  for(let i = 0, l = propertiesArr.length; i < l; i++) {
    const currentData = propertiesArr[i]
    const prevData = propertiesArr[i - 1]
    let node: t.ObjectProperty 
    if(currentData.startsWith('// ')) {
      continue
    } else {
      node = t.objectProperty(t.stringLiteral(currentData), t.stringLiteral(''))
    }
    if(prevData && prevData.startsWith('// ')) {
      let commentKey = prevData.replace('//', '').replace(/\\/g, ' => ')
      commentKeyArr.push(commentKey)
      nodeObj[commentKey] = []
    }
    const key = commentKeyArr[commentKeyArr.length - 1] || 'noComment'
    
    nodeObj[key].push(node)
  }
  return nodeObj
}



function _createCommentNode(nodeObj: NodeCommentObj): t.ObjectProperty[] {
  const keys = Object.keys(nodeObj);
  if(keys.length === 0) return []
  return keys.reduce((prev: t.ObjectProperty[], key) => {
    const nodeArr = nodeObj[key];
    if(nodeArr.length === 0) return prev
    if(key === 'noComment') return prev.concat(nodeArr)
    const firstNode = nodeObj[key][0]
    const comment: Comment = {
      type: "CommentLine",
      value: key
    };
    firstNode.leadingComments = firstNode.leadingComments || []
    ;(firstNode.leadingComments as any).push(comment)
    return prev.concat(nodeArr)
  }, [])
}

function _insertNode(nodeArr: t.ObjectProperty[], propertyPath: NodePath) {
  nodeArr.forEach(node => {
    propertyPath.insertBefore(node)
  })
}

function _createObjectExpressionVisit(nodeObj: NodeCommentObj) {
  const keys = Object.keys(nodeObj)
  return {
    ObjectExpression(path: NodePath<t.Node>) {
      const properties = path.get('properties') as NodePath<t.Node>[]
      let key: string | null = null
      // 为了compare的时候把相同注释的部分放到一起, 否则会直接加在最底下
      for(let i = 0, l = properties.length; i < l; i++ ) {
        const propertie = properties[i].node
        const leadingComments = propertie.leadingComments;
        if(!leadingComments) continue;
        if(key) {
          _insertNode(nodeObj[key],  properties[i])
          delete nodeObj[key]
          key = null
        }
        const comment = leadingComments[leadingComments.length - 1].value
        const index = keys.indexOf(comment)
        if(index !== -1) {
          key = keys[index]
          keys.splice(index, 1)
        }
      }
      path.pushContainer('properties', _createCommentNode(nodeObj))
    }
  }
}

export function generateNewCode(data: string, properties: string[]) {
  const ast = parser.parse(data)
  traverse(ast, {
    VariableDeclaration(path: NodePath<t.Node>) {
      path.traverse(_createObjectExpressionVisit(_createNodeObj(properties)))
    }
  })
  return generate(ast, {
    jsescOption: {
      minimal: true
    }
  }).code
}
