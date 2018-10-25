import { createComponent, setComponentProps } from "./component-helper"
import { setAttribute } from "./dom"
import { diff } from './diff'
import {
  TEXT_NODE,
  ELEMENT_NODE,
  TAG_TEXT,
  TAG_CLASS_COMPONENT,
  TAG_FUNCTION_COMPONENT,
  TAG_HIGH_ORDER_COMPONENT,
} from "./constants";


/**
 * render
 * @param {String|VNode} vnode Virtual Node
 * @param {HTMLElement} container DOM Container
 */
export default function render(vnode, container, dom) {
  return diff(dom, vnode, container);
  // return container.appendChild(renderVnode(vnode))
}


/**
 * renderVnode
 * @param {String|VNode} vnode Virtual Node
 */
export function renderVnode(vnode){
  let dom;

  // Handle when vnode is one of `null`, `undefined` or `false`
  if (vnode === null || vnode === false || vnode === undefined) return;

  // TextNode
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (vnode === ' ') return;
    return dom = document.createTextNode(vnode)
  }

  // DOMElement
  if (typeof vnode === 'object' && vnode.tag) {
    const { tag, props = {}, children } = vnode

    if (typeof tag === 'function') {
      // Stateless Component & State Component
      const component = createComponent(tag, props)
      setComponentProps(component, props);

      return component.base;
    }

    dom = document.createElement(tag)

    if (props) {
      Object.keys(props).forEach(name => {
        setAttribute(dom, name, props[name])
      })
    }

    if (children && children.length) {
      children.forEach(child => {
        dom.appendChild(renderVnode(child))
      });
    }

    return dom;
  }

  return dom;
}
