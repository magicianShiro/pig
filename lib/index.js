#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pick_1 = __importDefault(require("./utils/pick"));
var inputHandle_1 = __importDefault(require("./init/inputHandle"));
var validateHandle_1 = __importDefault(require("./init/validateHandle"));
var fileHandle_1 = __importDefault(require("./init/fileHandle"));
var dataHandle_1 = __importDefault(require("./init/dataHandle"));
var outPutHandle_1 = __importDefault(require("./init/outPutHandle"));
var pick = new pick_1.default();
pick.use(validateHandle_1.default);
pick.use(inputHandle_1.default);
pick.use(fileHandle_1.default);
pick.use(dataHandle_1.default);
pick.use(outPutHandle_1.default);
pick.exec();
