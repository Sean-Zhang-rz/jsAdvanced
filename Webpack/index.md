## 如何将你写的代码转换成低版本代码
1. parse: 把代码code变成AST
2. traverse: 遍历AST进行修改
3. generate: 把AST变成代码code2

### 如何将let转换成var
1. parse
  ```typescript
    const code = `let a = 'let'; let b = 2`;
    const ast = parse(code, { sourceType: 'module' });
  ```
在node中打印出结果，看着有点费劲，没关系，我们去浏览器里看
```bash
  node -r ts-node/register --inspect-brk Webpack/let_to_var.ts
```
打开浏览器进入控制台，等待一会，点击node标志，查看代码

2. traverse
  ```typescript
    traverse(ast, {
      enter: (item) => {
        if (item.node.type === 'VariableDeclaration') {
          if (item.node.kind === 'let') {
            item.node.kind = 'var';
          }
        }
      },
    });
  ```
3. generate
  ```typescript
    const result = generate(ast, {}, code);
  ```

### 将js代码转换成es5代码
```typescript
  const path = require('path');
  let file = path.join(__dirname, './fsFile/index.ts');
  const code = fs.readFileSync(file).toString();
  const ast = parse(code, { sourceType: 'module' });
  const result = babel.transformFromAstSync(ast, code, {
    presets: ['@babel/preset-env'],
  });
```

### 分析依赖
用哈希表存储文件依赖
1. 调用collectCodeAndDeps(index.js)
2. 先把depRelation['index.js']初始化为{deps: [], code: 'index.js的源码'}
3. 然后把index.js源码code变成ast
4. 遍历ast，看看import了哪些依赖，假设依赖了a.js和b.js
5. 把a.js和b.js写到depRelation['index.js'].deps里
6. 最终得到的depRelation就收集了index.js的依赖
```typescript
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
```
#### 如果有深层依赖，递归查找
```typescript
  // ...
  const depProjectPath = getProjectPath(depAbsolutePath)
  depRelation[key].deps.push(depProjectPath)
  collectCodeAndDeps(depAbsolutePath)
  // ...
```

#### 循环依赖
虽然代码运行不了，但是应该可以分析依赖，称为静态分析
检测key避免重复
```typescript
  // ...
  const key = getProjectPath(filepath) // 文件的项目路径，如 index.js
  if(Object.keys(depRelation).includes(key)) return
  // ...
```