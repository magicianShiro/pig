"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    target: '',
    extname: ['.js'],
    ignoreDir: [],
    babelParse: {
        sourceType: 'module',
        plugins: ["jsx", 'classProperties', 'dynamicImport'],
    },
    output: {
        filename: 'language.js',
        dirpath: '/dist'
    }
};
