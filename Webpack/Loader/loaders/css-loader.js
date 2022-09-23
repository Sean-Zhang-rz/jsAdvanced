const transform = code => `
  const str = ${JSON.stringify(code)}
  export default str
`
module.exports = transform