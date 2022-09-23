const transform = code => `
  const str = ${JSON.stringify(code)}
    if (document) {
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(code)}
    document.head.appendChild(style)
  }
  export default str
`
module.exports = transform