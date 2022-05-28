## 串行 or 并行

以下代码是并行的不能起到 await 的串行效果

```
async function doTask() {
  [task1, task2, task3].forEach((t) => {
    await t()
  })
}
```

要写成

```
async function doTask() {
  for (const t of [task1, task2, task3]) {
    await t()
  }
}
```

## 错误处理的优化写法

#### await 与 then 结合 左边处理成功，右边处理错误

```
const async = function() {
  return new Promise((res, rej) => {
    rej({
      status:400
    })
  })
}
const error = (e) => {
  console.log(e)
  throw e
}
async function fn() {
  const response = await ajax().then(null, error)
}
```

## 待补充 排队取餐逻辑
