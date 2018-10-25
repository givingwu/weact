import { CLASS_NAME, STYLE_NAME, TEXT_NODE, ELEMENT_NODE, ATTR_KEY } from "./constants";
import Component from "../react/component";


export function setAttribute(dom, name, value) {
  if (name === CLASS_NAME) name = 'class'

  if (name === STYLE_NAME) {
    if (!value || typeof value === 'string') dom.style.cssText = value || ''
    if (value && typeof value === 'object') {
      // Supports number to be number + `px`
      for (let name in value) {
        const val = value[name]

        if (typeof val === 'number') {
          dom.style.name = val + 'px'
        } else {
          dom.style[name] = val
        }
      }
    }
  } else if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
  } else {
    if (value) {
      if (name in dom) {
        dom[name] = value
      }

      // Supports `class`, cause class is not in dom, its real name is `className`
      // But could use `Element.setAttribute`, to learn more `https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute`
      dom.setAttribute(name, value)
    } else {
      dom.removeAttribute(name)
    }
  }
}


/**
 * isSameNodeType
 * @param {HTMLElement} dom
 * @param {VNode} vnode
 * @returns {Boolean}
 */
export function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === TEXT_NODE
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeType === ELEMENT_NODE && dom.nodeName.toUpperCase() === vnode.tag.toUpperCase()
  }

  return dom && dom._component && dom._component.constructor === vnode.tag;
}


/**
 * replaceNode
 * @description 从旧元素的父节点替换旧元素到新元素
 * @param {HTMLElement} newNode HTMLElement
 * @param {HTMLElement} oldNode HTMLElement
 * @returns {false | HTMLElement} If replaceChild success will return the newNode
 */
export function replaceNode(newNode, oldNode) {
  const ret = oldNode && oldNode.parentNode.replaceChild(newNode, oldNode)

  // for GC
  if (ret) {
    oldNode = null
  }

  return ret;
}


/**
 * removeNode
 * @param {*} dom Which dom need be removed
 * @returns {false | HTMLElement} If removeChild success will return the oldNode
 */
export function removeNode(dom) {
  const ret = dom && dom.parentNode.removeChild(dom)

  // for GC
  if (ret) {
    dom = null
  }

  return ret;
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
export function removeChildren(node) {
  node = node.lastChild

	while (node) {
		let next = node.previousSibling
		recollectNodeTree(node, true)
		node = next
	}
}


/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
export function recollectNodeTree(node, unmountOnly) {
	let component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
  }

	else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node[ATTR_KEY]!=null) applyRef(node[ATTR_KEY].ref, null);

		if (unmountOnly===false || node[ATTR_KEY]==null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}


const recyclerComponents = []
/**
 * https://github.com/developit/preact/blob/master/src/vdom/component.js#L268
 * @param {Component | Function} component Which component need be removed
 */
function  unmountComponent(component) {
  let base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	let inner = component._component;
	if (inner) {
		unmountComponent(inner);
	}
	else if (base) {
		// if (base[ATTR_KEY]!=null) applyRef(base[ATTR_KEY].ref, null);
		component.nextBase = base;

		removeNode(base);
		recyclerComponents.push(component);

		removeChildren(base);
	}
}