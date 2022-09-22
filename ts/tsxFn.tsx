// 函数组件
const Header = (props: {level: number}, context: unknown) => {
  return <h1>我的等级是{props.level}</h1>
}

const App = <Header level={1}>{123}</Header>

// 类组件
class ClassHeader {
  props: {
    level: number
  }
  constructor(props: { level: number }) {
    this.props = props
  }
  render() {
    return <h1>{this.props.level}</h1>
  }
}
const App2 = <ClassHeader level={1}></ClassHeader>
export {}