// import { renderVnode } from './render'
import Component from '../react/component'
import { diffNode } from './diff'

export function createComponent(component, props) {
  // from preact?
  let inst;

  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    // Make a new instance of Component
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function() {
      return this.constructor(props);
    }
  }

  return inst;
}

export function setComponentProps(component, props) {
  // Not Mount, So execute componentWillMount
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;
  renderComponent(component);
}

export function renderComponent(component) {
  let base;

  // Render component, just executes `React.createElement()` function.
  const renderer = component.render();

  // If it be mounted before
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base = diffNode(component.base, renderer);

  if (component.base) {
    // did update
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    // did mount
    component.componentDidMount();
  }

  // replace child
  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }

  component.base = base;
  base._component = component;
}