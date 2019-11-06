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
var babelTypes = __importStar(require("@babel/types"));
var config_1 = __importDefault(require("../config"));
var fs_1 = __importDefault(require("fs"));
var ReadFileQuene = /** @class */ (function () {
    function ReadFileQuene(options) {
        this.rootPath = options.rootPath || 'src';
        this.async = options.async || 5;
        this.currentyExecu = this.async;
        this.execuQuene = options.execuQuene || [];
        this.finish = options.finish;
        this.everyFinish = options.everyFinish;
        this.result = {};
        this.total = 0;
        this.current = 0;
        this.chineseReg = /((?<=')(((?!lan|'|\)|:|}|>|=).)*|((?!'.*:).)*\\'((?!'.*:).)*)[\u4e00-\u9fa5]+(((?!'|\\'|`).)*|((?!'.*:).)*\\'((?!'|'.*:).)*)(?='))|((?<=")(((?!lan|"|\)|:|}|>|=).)*|((?!".*:).)*\\"((?!".*:).)*)[\u4e00-\u9fa5]+(((?!"|\\"|`).)*|((?!".*:).)*\\"((?!"|".*:).)*)(?="))/g;
        // 前面是//注释, 后面是/** */注释
        this.commentReg = /(?<!(http:|https:|\\))\/\/.*(?=\n|\r\n)|(\s+|{)\/\*(.|\s)*?\*\//g;
    }
    ReadFileQuene.prototype.pushQuene = function (path) {
        this.execuQuene.push(this.readFile(path));
        this.total++;
        return path;
    };
    ReadFileQuene.prototype.popQuene = function (num) {
        return this.execuQuene.splice(0, num);
    };
    ReadFileQuene.prototype.readFile = function (path) {
        var _this = this;
        return function () { return new Promise(function (resolve, reject) {
            fs_1.default.readFile(path, 'utf-8', function (err, data) {
                if (err)
                    return reject(err);
                return resolve({
                    path: _this.rootPath + path.split(_this.rootPath)[1],
                    data: data
                });
            });
        }); };
    };
    ReadFileQuene.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.execuQuene.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.execu()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, this.result];
                }
            });
        });
    };
    ReadFileQuene.prototype._getAstParseData = function (data) {
        var ast = parser.parse(data, config_1.default.babelParse);
        var chinese = [];
        traverse_1.default(ast, {
            enter: function (path) {
                babelTypes.removeComments(path.node);
                if (path.type === 'StringLiteral') {
                    var value = path.node.value;
                    if (/[\u4e00-\u9fa5]+/g.test(value)) {
                        chinese.push(value);
                    }
                }
            }
        });
        return chinese;
    };
    ReadFileQuene.prototype.execu = function (num) {
        if (num === void 0) { num = this.async; }
        return __awaiter(this, void 0, void 0, function () {
            var readFilePromiseFnArr, retArr;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        readFilePromiseFnArr = this.popQuene(num).map(function (fn) { return fn(); });
                        return [4 /*yield*/, Promise.all(readFilePromiseFnArr)];
                    case 1:
                        retArr = _a.sent();
                        retArr.forEach(function (_a) {
                            var data = _a.data, path = _a.path;
                            var chinese = _this._getAstParseData(data);
                            if (chinese) {
                                _this.result[path] = chinese.filter(function (v) { return v; });
                            }
                            _this.current++;
                        });
                        this.everyFinish && this.everyFinish({ total: this.total, current: this.current });
                        return [2 /*return*/, this.next()];
                }
            });
        });
    };
    return ReadFileQuene;
}());
exports.default = ReadFileQuene;
