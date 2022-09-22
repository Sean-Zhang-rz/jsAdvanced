import {parse} from '@babel/parser'
import traverse from '@babel/traverse'
import {readFileSync} from 'fs'
import {resolve, relative, dirname} from 'path'

// 设置根目录
const projectRoot = resolve(__dirname, 'p1')
// 类型声明
type DepRelation = {
  [key: string]: {
    deps: string[],
    code:string
  }
}
// 初始化一个空的 depRelation，用于收集依赖
const depRelation: DepRelation = {}

collectCodeAndDeps(resolve(projectRoot, 'index.js'))
console.log(depRelation);
console.log('done');

function collectCodeAndDeps(filepath: string) {
  const key = getProjectPath(filepath) // 文件的项目路径，如 index.js
  // 获取文件内容，将内容放至 depRelation
  const code = readFileSync(filepath).toString()
  // 初始化 depRelation[key]
  depRelation[key] = { deps: [], code: code }
  // 将代码转为 AST
  const ast = parse(code, { sourceType: 'module' })
  // 分析文件依赖，将内容放至 depRelation
  traverse(ast, {
    enter: path => {
      if (path.node.type === 'ImportDeclaration') {
        // path.node.source.value 往往是一个相对路径，如 ./a.js，需要先把它转为一个绝对路径
        const depAbsolutePath = resolve(dirname(filepath), path.node.source.value)
        // 然后转为项目路径
        const depProjectPath = getProjectPath(depAbsolutePath)
        // 把依赖写进 depRelation
        depRelation[key].deps.push(depProjectPath)
      }
    }
  })
}
// 获取文件相对于根目录的相对路径
function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, '/')
}