import { renderComponent } from '../react-dom/component-helper'

export default class Component {
  // static isReactComponent = true

  constructor(props = {}) {
    this.isReactComponent = true
    this.state = {}
    this.props = props;
  }

  setState(stateOrFn, callback) {
    if (typeof stateOrFn === 'function') {
      const newState = stateOrFn()

      if (typeof newState !== 'object') {
        throw new TypeError(`this.setState((stateChange: Function) => object) must return an object!`)
      } else {
        this.state = newState
      }
    } else if (typeof stateOrFn === 'object') {
      this.state = stateOrFn
    } else {
      throw new TypeError(`this.setState only accept 'function' or 'object', not this type ${typeof stateOrFn}`)
    }

    renderComponent(this);
  }

  render() {
    throw "Must implements render function.";
  }
}

Object.defineProperty(Component, 'isReactComponent', {
  value: true,
  configurable: false,
  enumerable: false
})