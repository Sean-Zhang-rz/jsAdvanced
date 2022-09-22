import { parse } from '@babel/parser';
import * as babel from '@babel/core';
import * as fs from 'fs';

const path = require('path');
let file = path.join(__dirname, './fsFile/index.ts');
const code = fs.readFileSync(file).toString();
const ast = parse(code, { sourceType: 'module' });
const result = babel.transformFromAstSync(ast, code, {
  presets: ['@babel/preset-env'],
});
console.log(result!.code);

fs.writeFileSync('./WebPack/index.es5.js', result!.code!);
