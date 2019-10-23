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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var babel = __importStar(require("@babel/core"));
var common_1 = require("../utils/common");
// 获取自定义的config文件内容
function _getCustomConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var pigrc, _a, _b, _c, esmToCmj, pigrcPath, _d, _e, _f, configExport;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = common_1.readFile;
                    _c = (_b = path_1.default).join;
                    return [4 /*yield*/, common_1.getRootPath()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_c.apply(_b, [_g.sent(), 'pigrc.js'])])];
                case 2:
                    pigrc = _g.sent();
                    esmToCmj = babel.transformSync(pigrc, {
                        plugins: ['transform-es2015-modules-commonjs']
                    }).code;
                    pigrcPath = path_1.default.join(__dirname, './pigrc.js');
                    _d = "var __dirname = ";
                    _f = (_e = JSON).stringify;
                    return [4 /*yield*/, common_1.getRootPath()];
                case 3:
                    // 改写写入文件中的__dirname
                    esmToCmj = _d + _f.apply(_e, [_g.sent()]) + "; \r\n" + esmToCmj;
                    return [4 /*yield*/, common_1.writeFile(pigrcPath, esmToCmj)];
                case 4:
                    _g.sent();
                    configExport = require('./pigrc');
                    return [4 /*yield*/, common_1.removeFile(pigrcPath)];
                case 5:
                    _g.sent();
                    return [2 /*return*/, configExport.default ? configExport.default : configExport];
            }
        });
    });
}
function validateHandle(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var customConfig, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _getCustomConfig()];
                case 1:
                    customConfig = _a.sent();
                    config = Object.assign(ctx.config, customConfig);
                    if (!config.target)
                        throw new Error('param target is required!');
                    ctx.config = config;
                    return [4 /*yield*/, next()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = validateHandle;
