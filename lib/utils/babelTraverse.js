"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser = __importStar(require("@babel/parser"));
var traverse_1 = __importDefault(require("@babel/traverse"));
var t = __importStar(require("@babel/types"));
var generator_1 = __importDefault(require("@babel/generator"));
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
function _createNodeObj(propertiesArr, compareOrigin) {
    var nodeObj = { noComment: [] };
    var commentKeyArr = [];
    for (var i = 0, l = propertiesArr.length; i < l; i++) {
        var currentData = propertiesArr[i];
        var prevData = propertiesArr[i - 1];
        var node = void 0;
        if (currentData.startsWith('// ')) {
            continue;
        }
        else {
            var value = (compareOrigin && compareOrigin[currentData]) || '';
            node = t.objectProperty(t.stringLiteral(currentData), t.stringLiteral(value));
        }
        if (prevData && prevData.startsWith('// ')) {
            var commentKey = prevData.replace('//', '').replace(/\\/g, ' => ');
            commentKeyArr.push(commentKey);
            nodeObj[commentKey] = [];
        }
        var key = commentKeyArr[commentKeyArr.length - 1] || 'noComment';
        nodeObj[key].push(node);
    }
    return nodeObj;
}
function _createCommentNode(nodeObj) {
    var keys = Object.keys(nodeObj);
    if (keys.length === 0)
        return [];
    return keys.reduce(function (prev, key) {
        var nodeArr = nodeObj[key];
        if (nodeArr.length === 0)
            return prev;
        if (key === 'noComment')
            return prev.concat(nodeArr);
        var firstNode = nodeObj[key][0];
        var comment = {
            type: "CommentLine",
            value: key
        };
        firstNode.leadingComments = firstNode.leadingComments || [];
        firstNode.leadingComments.push(comment);
        return prev.concat(nodeArr);
    }, []);
}
function _insertNode(nodeArr, propertyPath) {
    nodeArr.forEach(function (node) {
        propertyPath.insertBefore(node);
    });
}
function _createObjectExpressionVisit(nodeObj) {
    var keys = Object.keys(nodeObj);
    return {
        ObjectExpression: function (path) {
            var properties = path.get('properties');
            var key = null;
            // 为了compare的时候把相同注释的部分放到一起, 否则会直接加在最底下
            for (var i = 0, l = properties.length; i < l; i++) {
                var propertie = properties[i].node;
                var leadingComments = propertie.leadingComments;
                if (!leadingComments)
                    continue;
                if (key) {
                    _insertNode(nodeObj[key], properties[i]);
                    delete nodeObj[key];
                    key = null;
                }
                var comment = leadingComments[leadingComments.length - 1].value;
                var index = keys.indexOf(comment);
                if (index !== -1) {
                    key = keys[index];
                    keys.splice(index, 1);
                }
            }
            path.pushContainer('properties', _createCommentNode(nodeObj));
        }
    };
}
function generateNewCode(data, properties, compareOrigin) {
    var ast = parser.parse(data, { sourceType: "module" });
    traverse_1.default(ast, {
        VariableDeclaration: function (path) {
            path.traverse(_createObjectExpressionVisit(_createNodeObj(properties, compareOrigin)));
        }
    });
    return generator_1.default(ast, {
        jsescOption: {
            minimal: true
        }
    }).code;
}
exports.generateNewCode = generateNewCode;
function traverseFileToObj(data) {
    var ast = parser.parse(data, { sourceType: "module" });
    var resultObj = {};
    traverse_1.default(ast, {
        VariableDeclaration: function (variablePath) {
            variablePath.traverse({
                ObjectExpression: function (objectPath) {
                    objectPath.traverse({
                        Property: function (propertyPath) {
                            var key = propertyPath.node.key.value;
                            var valueNode = propertyPath.node.value;
                            var value = '';
                            if (t.isTemplateLiteral(valueNode)) {
                                propertyPath.traverse({
                                    TemplateElement: function (path) {
                                        value = path.node.value.raw;
                                    }
                                });
                            }
                            else {
                                propertyPath.traverse({
                                    StringLiteral: function (path) {
                                        value = path.node.value;
                                    }
                                });
                            }
                            resultObj[key] = value;
                        }
                    });
                }
            });
        }
    });
    return resultObj;
}
exports.traverseFileToObj = traverseFileToObj;
