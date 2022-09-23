// 无法使用，有问题
const transform = code => `
  if (document) {
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(code)}
    document.head.appendChild(style)
  }
`
module.exports = transform