import React from "./react";
import ReactDOM from "/react-dom";
// import * as React from 'preact'
// console.log(React);

const list = [{
  content: '2'
}, {
  content: '1' // forward
}, {
  content: '4', // backward
}, {
  content: '3'
}, // 5 insert
 {
  content: '6' // delete
}, /*  {
  content: '7' // append
} */]

class List extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      list
    }
  }

  // 前移
  forward () {
    const ref1 = list[1]
    const ref2 = list[0]

    list[0] = ref1
    list[1] = ref2

    this.setState({
      list: list
    })
  }

  // 后移
  backward () {
    const ref1 = list[3]
    const ref2 = list[2]

    list[2] = ref1
    list[3] = ref2

    this.setState({
      list
    })
  }

  // 插入
  insert () {
    const ref = { content: 5 }
    list.splice(4, 0, ref)

    this.setState({
      list
    })
  }

  // 追加
  append () {
    list.push({
      content: 7
    })

    this.setState({
      list
    })
  }

  // 删除
  remove () {
    list.splice(6, 1)

    this.setState({
      list
    })
  }

  render() {
    return (
      <div className="container">
        <ul>
          {
            this.state.list.map(({ content }) => (<li key={content}>{content}</li>))
          }
        </ul>
        <div className="buttons">
          <button onClick={this.forward.bind(this)}>forward</button>
          <button onClick={this.backward.bind(this)}>backward</button>
          <button onClick={this.insert.bind(this)}>insert</button>
          <button onClick={this.append.bind(this)}>append</button>
          <button onClick={this.remove.bind(this)}>remove</button>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <List />
    );
  }
}


console.time('render')
ReactDOM.render(<App />, document.querySelector('#root'))
console.timeEnd('render')

console.log(
  ReactDOM.render(
    React.createElement(App, null)
  )
);



window.list = list
window.React = React
window.ReactDOM = ReactDOM