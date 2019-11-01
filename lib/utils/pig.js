"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Context, IDefaultCtx } from '../index'
var config_1 = __importDefault(require("../config"));
var Pig = /** @class */ (function () {
    function Pig() {
        this.middleware = [];
    }
    Pig.prototype.createContext = function () {
        return {
            onerror: function (err) { return console.log(err); },
            respond: function (ctx) { return console.log('结束'); },
            rootPath: '',
            targetPath: '',
            // template: '',
            compareOrigin: {},
            // compareTemplate: '',
            lackTemplate: '',
            extraTemplate: '',
            allTemplate: '',
            extname: [],
            ignoreDir: [],
            output: {
                filename: '',
                dirpath: '',
            },
            chineseMap: {},
            outputData: '',
            compareData: '',
            config: config_1.default
        };
    };
    Pig.prototype.handleRequest = function (ctx, fnMiddleware) {
        var onerror = function (err) { return ctx.onerror(err); };
        var handleResponse = function () { return ctx.respond(ctx); };
        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    };
    Pig.prototype.callback = function () {
        var fn = this.compose(this.middleware);
        var ctx = this.createContext();
        return this.handleRequest(ctx, fn);
    };
    Pig.prototype.compose = function (middleware) {
        return function (context, next) {
            var index = -1;
            return dispatch(0);
            function dispatch(i) {
                if (i <= index)
                    return Promise.reject(new Error('next() called multiple times'));
                index = i;
                var fn = middleware[i];
                if (i === middleware.length)
                    fn = next;
                if (!fn)
                    return Promise.resolve();
                try {
                    return Promise.resolve(fn(context, function next() {
                        return dispatch(i + 1);
                    }));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
        };
    };
    Pig.prototype.use = function (fn) {
        this.middleware.push(fn);
        return this;
    };
    Pig.prototype.exec = function () {
        return this.callback();
    };
    return Pig;
}());
exports.default = Pig;
