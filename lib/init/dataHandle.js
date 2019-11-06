"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var customizeSet_1 = __importDefault(require("../utils/customizeSet"));
var babelTraverse_1 = require("../utils/babelTraverse");
function createParser(obj) {
    var keys = Object.keys(obj);
    return {
        getFormatKey: function (key) {
            return "// " + key;
        },
        parseObjToSet: function () {
            var _this = this;
            var customizeSet = new customizeSet_1.default();
            keys.forEach(function (key) {
                customizeSet.add(_this.getFormatKey(key));
                customizeSet.add(obj[key]);
            });
            return customizeSet;
        },
        parseArrToObj: function (distinctArr) {
            var _this = this;
            var prevKeyIndex = 0;
            return keys.reduce(function (prev, key) {
                var index = distinctArr.indexOf(_this.getFormatKey(key));
                var sliceArrByKey = distinctArr.slice(prevKeyIndex, index);
                // 删除掉去重之后的空数组的路径
                if (sliceArrByKey.length > 0) {
                    prev[key] = sliceArrByKey;
                }
                prevKeyIndex = index + 1;
                return prev;
            }, {});
        }
    };
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
function hasCompare(ctx, chineseSet) {
    var compareOrigin = ctx.compareOrigin, compareOriginFile = ctx.compareOriginFile, extraTemplate = ctx.extraTemplate, lackTemplate = ctx.lackTemplate;
    var templateSet = new customizeSet_1.default({ dataStore: Object.keys(compareOrigin) });
    // 和模板对比之后的补集(也就是模板中没有的中文部分)
    var lackDiff = templateSet.difference(chineseSet);
    var extraDiff = chineseSet.difference(templateSet);
    // 求交集
    // const unionArr = templateSet.union(chineseSet)
    var allData = babelTraverse_1.generateNewCode(compareOriginFile, lackDiff.getArr());
    var extraData = babelTraverse_1.generateNewCode(extraTemplate, extraDiff.getArr(), compareOrigin);
    var lackData = babelTraverse_1.generateNewCode(lackTemplate, lackDiff.getArr());
    return {
        allData: allData,
        extraData: extraData,
        lackData: lackData
        // allData: getOutPutStr(clearEmptyArrPath(unionArr.getArr()), 'all', ctx),
        // extraData: getOutPutStr(clearEmptyArrPath(extraDiff.getArr()), 'extra', ctx),
        // lackData: getOutPutStr(clearEmptyArrPath(lackDiff.getArr()), 'lack', ctx)
    };
}
function dataHandle(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var chineseMap, compareOrigin, allTemplate, parser, chineseSet, outputData, _a, allData, extraData, lackData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chineseMap = ctx.chineseMap, compareOrigin = ctx.compareOrigin, allTemplate = ctx.allTemplate;
                    parser = createParser(chineseMap);
                    chineseSet = parser.parseObjToSet();
                    outputData = babelTraverse_1.generateNewCode(allTemplate, chineseSet.getArr());
                    // 是否需要对比
                    if (compareOrigin) {
                        _a = hasCompare(ctx, chineseSet), allData = _a.allData, extraData = _a.extraData, lackData = _a.lackData;
                        outputData = allData;
                        ctx.compareData = extraData + '\r\n' + lackData;
                    }
                    ctx.outputData = outputData;
                    return [4 /*yield*/, next()];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = dataHandle;
