import { TEXT_NODE } from "./constants"
import { setComponentProps, createComponent } from "./component-helper"
import { isSameNodeType, replaceNode, removeNode, recollectNodeTree, setAttribute } from "./dom"
// import { renderComponent } from './render'


/**
 * diff
 * @param {HTMLElement} dom
 * @param {VNode} vnode
 * @param {HTMLElement} container
 */
export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode)

  // 如果有容器存在且返回的 ret.parentNode 不等于该容器，则在该容器中插入 ret
  if (container) {
    if (ret.parentNode !== container) {
      container.appendChild(ret);
    }
  }

  return ret;
}


/**
 * diffNode
 * @param {HTMLElement} dom Real DOM
 * @param {VNode} vnode Virtual Dom
 * @returns {HTMLElement} After dynamic updates
 * @description
 *  1. vnode 是 string, 判断真实 dom 是否是文本节点
 *    1.1 Y 继续比对 dom.textContent 是否一致，不一致则更新内部textContent
 *    1.2 N 创建新的文本节点 out -> replaceDom(new: out, old: dom)
 *  2. vnode 是 object, 判断 vnode 的 tag
 *    2.1 function -> diffComponent(dom, vnode)
 *    2.2 text(built-ins tags) -> isSameNodeType(dom, vnode)
 *      2.2.1 Y -> Step 3
 *      2.2.2 N -> 创建新元素 out = document.createElement(vnode.tag)
 *              -> 复制子元素 [...dom.childNodes].forEach(out.appendChild)
 *              -> 替换新元素 replaceDom(new: out, old: dom)
 *  3. vnode 有子元素
 *    3.1 Y -> diffChildren(dom, vnode)
 *    3.2 N -> Step 4
 *  4. diffAttributes
 */
export function diffNode(dom, vnode) {
  let out = dom;

  if (typeof vnode === 'undefined' || vnode === undefined || vnode === null || typeof vnode === 'boolean') return vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode);

  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === TEXT_NODE) {
      if (dom.textContent !== vnode) {
        out.textContent = vnode
      }
    } else {
      // The `Node.replaceChild()` method replaces one child node of the specified node with another.
      // Syntax: `replacedNode = parentNode.replaceChild(newChild, oldChild);`
      out = document.createTextNode(vnode)
      replaceNode(out, dom)

      return out;
    }
  } else {
    const { tag/* , props = {}, children */ } = vnode

    if (typeof tag === 'function') {
      // 如果是函数式组件或者类组件
      // 则调用 diffComponent 并返回 diff 后的 dom 元素
      return diffComponent(dom, vnode)
    } else {
      // 如果不存在被 diff 的 dom 元素，即还未创建这个 dom 元素
      // 或 dom 和 vnode 不是相同 nodeType 节点类型时
      if (!dom || !isSameNodeType(dom, vnode)) {
        // create a new real dom of vnode
        // 先创建这个 dom 元素
        if (tag && typeof tag === 'string') out = document.createElement(tag)
        else return

        // 如果有 dom 但是是不相同的 nodeType 节点类型时，先创建 out 的真实 dom 元素
        // 然后将 dom 中所有的子元素节点全部插入到 out 中，
        // 最后再将原先 dom 元素的位置替换成最新的 out 元素，
        // （即从 dom 元素父节点替换掉了这个 dom 标签，但保留了原标签中所有的子元素）
        if (dom) {
          // `...` destruct a Array-Like object to be a real array
          // Append the children nodes from `dom` to `out`
          [...dom.childNodes].map.call(Array.prototype, out.appendChild)
          replaceNode(out, dom)
        }
      }
    }
  }

  // 如果 vnode 有子元素或者 out.childNodes 有子节点，就进入 diffChildren 函数
  if (vnode && vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.children)
  }

  diffAttributes(out, vnode.props || {})

  return out;
}


/**
 * diffComponent
 * @param {HTMLElement | undefined} dom HTMLElement
 * @param {VNode} vnode Virtual dom
 */
function diffComponent(dom, vnode) {
  let component = dom && dom._component;
  let oldDom = dom;

  // if constructor does not change, reset props again
  if (component && component.constructor === vnode.tag) {
    setComponentProps(component, vnode.props || {})
  } else {
    // Remove old dom, and render new one
    if (component) {
      if (component.componentWillUnmount) component.componentWillUnmount();
      removeNode(component.base)
      component = null
    }

    component = createComponent(vnode.tag, vnode.props)
    setComponentProps(component, vnode.props || {})
    dom = component.base

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }

  return dom;
}


/**
 * diffChildren
 * @param {HTMLElement|undefined} dom HTMLElement
 * @param {VNodeCollection<Vnode>} vnodeChildren Vnode Collection
 */
function diffChildren(dom, vnodeChildren) {
  const keyedNodesMap = {} // 有 key 的元素 map
  const unkeyedNodesList = [] // 没有 key 的元素 list
  const domChildNodes = dom.childNodes // 获取所有的子元素
  let keyedLen = 0 // 标记 key 的长度
  let unkeyedNodesLen = 0 // 未标记 key 的元素集合的长度
  let vnodeLen = vnodeChildren.length || 0

  // 遍历 domChildNodes 集合，收集 key 标记和无 key 标记
  for (let i = 0; i < domChildNodes.length; i++) {
    const domChildNode = domChildNodes[i];

    // 如果元素有 key 属性，则记录到 keyedNodesMap
    // 否则 push 到 children 数组
    if (domChildNode.key) {
      keyedLen++
      keyedNodesMap[key] = domChildNode
    } else {
      unkeyedNodesList[unkeyedNodesLen++] = domChildNode
    }
  }

  if (vnodeLen > 0) {
    let startPosFlag = 0; // 起点位置 flag 变量

    for (let i = 0; i < vnodeLen; i++) {
      const vnodeChild = vnodeChildren[i]; // 当前 vnode
      const key = vnodeChild.key; // 获取当前 vnode 的 key 属性
      let child = null;

      if (key) { // 如果存在 key
        if (keyedLen && keyedNodesMap[key]) { // 且 key 存在与当前真实的 dom.childNodes 集合中
          child = keyedNodesMap[key] // // 直接赋值当前 child 到真实 domChild
          keyedNodesMap[key] = null // GC

          keyedLen--
        }
      } else if (startPosFlag < unkeyedNodesLen) {
        // 其实这里的这种标记方法？存疑？为什么要用这样的标记方法？
        // 如果 起始位置标示变量 < 未被key标记的元素集合 长度，则循环当前的 unkeyedNodesList
        // 取出每一个 unkeyedNode 并与 vnodeChild 作比较且优先匹配 vnodeChild 相同节点类型
        for (let j = 0; j < unkeyedNodesLen; j++) {
          let unkeyedNode = unkeyedNodesList[j];

          if (unkeyedNode && isSameNodeType(unkeyedNode, vnodeChild)) {
            child = unkeyedNode // 配对成功，赋值 child
            unkeyedNodesList[j] = null // 配对成功，清空元素 & GC

            // 如果是最后一个元素 则整体长度减一
            if (j === unkeyedNodesLen - 1) unkeyedNodesLen--;
            // 如果 j === 起始位置长度，则 startPosFlag 加一
            if (j === startPosFlag) startPosFlag++;
            break;
          }
        }
      }

      // Executes `diffNode(child, vnodeChild)` algorithm
      // 执行 diffNode，返回 diff 之后的真实 DOM 结构
      const newDomNode = diffNode(child, vnodeChild)
      // 原先存在于该 `index` 位置的 domChildNode
      const oldDomNode = domChildNodes[i]

      /**
       * NODES LIST OPERATIONS ENUM:
       * forward 前移
       * backward 后移
       * insert 插入
       * append 追加
       * remove 删除
       */
      if (newDomNode && newDomNode !== dom && newDomNode !== oldDomNode) {
        // 如果更新前的对应位置为空，说明此节点是新增的，则新追加这个节点
        if (!oldDomNode) {
          dom.appendChild(newDomNode)
        } else if(newDomNode === oldDomNode.nextSibling) {
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
          removeNode(oldDomNode)
        } else {
          // 将更新后的节点移动到正确的位置
          // var insertedNode = parentNode.insertBefore(newNode, referenceNode);
          dom.insertBefore(newDomNode, oldDomNode)
        }
      }
    }
  }

  if (keyedLen) {
    for (const key in keyedNodesMap) {
      if (keyedNodesMap[key]) {
        recollectNodeTree(keyedNodesMap[key], false)
      }
    }
  }

  /*
  // FROM: https://github.com/developit/preact/blob/master/src/vdom/diff.js#L266
  // remove orphaned unkeyed children:
	while (startPosFlag <= unkeyedNodesLen) {
		if ((child = unkeyedNodesList[unkeyedNodesLen--]) !== undefined) recollectNodeTree(child, false)
  } */
}

function diffAttributes(dom, props) {
  for (const name in props) {
    if (props.hasOwnProperty(name)) {
      const value = props[name];

      if (value) {
        setAttribute(dom, name, value)
      } else {
        if (dom.getAttribute(name)) {
          setAttribute(dom, name, undefined)
        }
      }
    }
  }
}