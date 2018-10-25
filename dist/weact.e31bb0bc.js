// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"react-dom/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TAG_HIGH_ORDER_COMPONENT = exports.TAG_FUNCTION_COMPONENT = exports.TAG_CLASS_COMPONENT = exports.TAG_TEXT = exports.ATTR_KEY = exports.TEXT_NODE = exports.ELEMENT_NODE = exports.STYLE_NAME = exports.CLASS_NAME = void 0;
var CLASS_NAME = 'className';
exports.CLASS_NAME = CLASS_NAME;
var STYLE_NAME = 'style';
exports.STYLE_NAME = STYLE_NAME;
var ELEMENT_NODE = 1; // An Element node such as `<p>` or `<div>`

exports.ELEMENT_NODE = ELEMENT_NODE;
var TEXT_NODE = 3; // The actual `Text` of `Element` or `Attr`

exports.TEXT_NODE = TEXT_NODE;
var ATTR_KEY = '__react_attr__';
exports.ATTR_KEY = ATTR_KEY;
var TAG_TEXT = 'TEXT';
exports.TAG_TEXT = TAG_TEXT;
var TAG_CLASS_COMPONENT = 'CLASS_COMPONENT';
exports.TAG_CLASS_COMPONENT = TAG_CLASS_COMPONENT;
var TAG_FUNCTION_COMPONENT = 'FUNCTION_COMPONENT';
exports.TAG_FUNCTION_COMPONENT = TAG_FUNCTION_COMPONENT;
var TAG_HIGH_ORDER_COMPONENT = 'HIGH_ORDER_COMPONENT';
exports.TAG_HIGH_ORDER_COMPONENT = TAG_HIGH_ORDER_COMPONENT;
},{}],"react-dom/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttribute = setAttribute;
exports.isSameNodeType = isSameNodeType;
exports.replaceNode = replaceNode;
exports.removeNode = removeNode;
exports.removeChildren = removeChildren;
exports.recollectNodeTree = recollectNodeTree;

var _constants = require("./constants");

var _component = _interopRequireDefault(require("../react/component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function setAttribute(dom, name, value) {
  if (name === _constants.CLASS_NAME) name = 'class';

  if (name === _constants.STYLE_NAME) {
    if (!value || typeof value === 'string') dom.style.cssText = value || '';

    if (value && _typeof(value) === 'object') {
      // Supports number to be number + `px`
      for (var _name in value) {
        var val = value[_name];

        if (typeof val === 'number') {
          dom.style.name = val + 'px';
        } else {
          dom.style[_name] = val;
        }
      }
    }
  } else if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    dom[name] = value || '';
  } else {
    if (value) {
      if (name in dom) {
        dom[name] = value;
      } // Supports `class`, cause class is not in dom, its real name is `className`
      // But could use `Element.setAttribute`, to learn more `https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute`


      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}
/**
 * isSameNodeType
 * @param {HTMLElement} dom
 * @param {VNode} vnode
 * @returns {Boolean}
 */


function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === _constants.TEXT_NODE;
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeType === _constants.ELEMENT_NODE && dom.nodeName.toUpperCase() === vnode.tag.toUpperCase();
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


function replaceNode(newNode, oldNode) {
  var ret = oldNode && oldNode.parentNode.replaceChild(newNode, oldNode); // for GC

  if (ret) {
    oldNode = null;
  }

  return ret;
}
/**
 * removeNode
 * @param {*} dom Which dom need be removed
 * @returns {false | HTMLElement} If removeChild success will return the oldNode
 */


function removeNode(dom) {
  var ret = dom && dom.parentNode.removeChild(dom); // for GC

  if (ret) {
    dom = null;
  }

  return ret;
}
/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */


function removeChildren(node) {
  node = node.lastChild;

  while (node) {
    var next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}
/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */


function recollectNodeTree(node, unmountOnly) {
  var component = node._component;

  if (component) {
    // if node is owned by a Component, unmount that component (ends up recursing back here)
    unmountComponent(component);
  } else {
    // If the node's VNode had a ref function, invoke it with null here.
    // (this is part of the React spec, and smart for unsetting references)
    if (node[_constants.ATTR_KEY] != null) applyRef(node[_constants.ATTR_KEY].ref, null);

    if (unmountOnly === false || node[_constants.ATTR_KEY] == null) {
      removeNode(node);
    }

    removeChildren(node);
  }
}

var recyclerComponents = [];
/**
 * https://github.com/developit/preact/blob/master/src/vdom/component.js#L268
 * @param {Component | Function} component Which component need be removed
 */

function unmountComponent(component) {
  var base = component.base;
  component._disable = true;
  if (component.componentWillUnmount) component.componentWillUnmount();
  component.base = null; // recursively tear down & recollect high-order component children:

  var inner = component._component;

  if (inner) {
    unmountComponent(inner);
  } else if (base) {
    // if (base[ATTR_KEY]!=null) applyRef(base[ATTR_KEY].ref, null);
    component.nextBase = base;
    removeNode(base);
    recyclerComponents.push(component);
    removeChildren(base);
  }
}
},{"./constants":"react-dom/constants.js","../react/component":"react/component.js"}],"react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.diffNode = diffNode;

var _constants = require("./constants");

var _componentHelper = require("./component-helper");

var _dom = require("./dom");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// import { renderComponent } from './render'

/**
 * diff
 * @param {HTMLElement} dom
 * @param {VNode} vnode
 * @param {HTMLElement} container
 */
function diff(dom, vnode, container) {
  var ret = diffNode(dom, vnode); // 如果有容器存在且返回的 ret.parentNode 不等于该容器，则在该容器中插入 ret

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


function diffNode(dom, vnode) {
  var out = dom;
  if (typeof vnode === 'undefined' || vnode === undefined || vnode === null || typeof vnode === 'boolean') return vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode);

  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === _constants.TEXT_NODE) {
      if (dom.textContent !== vnode) {
        out.textContent = vnode;
      }
    } else {
      // The `Node.replaceChild()` method replaces one child node of the specified node with another.
      // Syntax: `replacedNode = parentNode.replaceChild(newChild, oldChild);`
      out = document.createTextNode(vnode);
      (0, _dom.replaceNode)(out, dom);
      return out;
    }
  } else {
    var _vnode = vnode,
        tag = _vnode.tag;

    if (typeof tag === 'function') {
      // 如果是函数式组件或者类组件
      // 则调用 diffComponent 并返回 diff 后的 dom 元素
      return diffComponent(dom, vnode);
    } else {
      // 如果不存在被 diff 的 dom 元素，即还未创建这个 dom 元素
      // 或 dom 和 vnode 不是相同 nodeType 节点类型时
      if (!dom || !(0, _dom.isSameNodeType)(dom, vnode)) {
        // create a new real dom of vnode
        // 先创建这个 dom 元素
        if (tag && typeof tag === 'string') out = document.createElement(tag);else return; // 如果有 dom 但是是不相同的 nodeType 节点类型时，先创建 out 的真实 dom 元素
        // 然后将 dom 中所有的子元素节点全部插入到 out 中，
        // 最后再将原先 dom 元素的位置替换成最新的 out 元素，
        // （即从 dom 元素父节点替换掉了这个 dom 标签，但保留了原标签中所有的子元素）

        if (dom) {
          // `...` destruct a Array-Like object to be a real array
          // Append the children nodes from `dom` to `out`
          _toConsumableArray(dom.childNodes).map.call(Array.prototype, out.appendChild);

          (0, _dom.replaceNode)(out, dom);
        }
      }
    }
  } // 如果 vnode 有子元素或者 out.childNodes 有子节点，就进入 diffChildren 函数


  if (vnode && vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out, vnode.children);
  }

  diffAttributes(out, vnode.props || {});
  return out;
}
/**
 * diffComponent
 * @param {HTMLElement | undefined} dom HTMLElement
 * @param {VNode} vnode Virtual dom
 */


function diffComponent(dom, vnode) {
  var component = dom && dom._component;
  var oldDom = dom; // if constructor does not change, reset props again

  if (component && component.constructor === vnode.tag) {
    (0, _componentHelper.setComponentProps)(component, vnode.props || {});
  } else {
    // Remove old dom, and render new one
    if (component) {
      if (component.componentWillUnmount) component.componentWillUnmount();
      (0, _dom.removeNode)(component.base);
      component = null;
    }

    component = (0, _componentHelper.createComponent)(vnode.tag, vnode.props);
    (0, _componentHelper.setComponentProps)(component, vnode.props || {});
    dom = component.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      (0, _dom.removeNode)(oldDom);
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
  var keyedNodesMap = {}; // 有 key 的元素 map

  var unkeyedNodesList = []; // 没有 key 的元素 list

  var domChildNodes = dom.childNodes; // 获取所有的子元素

  var keyedLen = 0; // 标记 key 的长度

  var unkeyedNodesLen = 0; // 未标记 key 的元素集合的长度

  var vnodeLen = vnodeChildren.length || 0; // 遍历 domChildNodes 集合，收集 key 标记和无 key 标记

  for (var i = 0; i < domChildNodes.length; i++) {
    var domChildNode = domChildNodes[i]; // 如果元素有 key 属性，则记录到 keyedNodesMap
    // 否则 push 到 children 数组

    if (domChildNode.key) {
      keyedLen++;
      keyedNodesMap[key] = domChildNode;
    } else {
      unkeyedNodesList[unkeyedNodesLen++] = domChildNode;
    }
  }

  if (vnodeLen > 0) {
    var startPosFlag = 0; // 起点位置 flag 变量

    for (var _i = 0; _i < vnodeLen; _i++) {
      var vnodeChild = vnodeChildren[_i]; // 当前 vnode

      var _key = vnodeChild.key; // 获取当前 vnode 的 key 属性

      var child = null;

      if (_key) {
        // 如果存在 key
        if (keyedLen && keyedNodesMap[_key]) {
          // 且 key 存在与当前真实的 dom.childNodes 集合中
          child = keyedNodesMap[_key]; // // 直接赋值当前 child 到真实 domChild

          keyedNodesMap[_key] = null; // GC

          keyedLen--;
        }
      } else if (startPosFlag < unkeyedNodesLen) {
        // 其实这里的这种标记方法？存疑？为什么要用这样的标记方法？
        // 如果 起始位置标示变量 < 未被key标记的元素集合 长度，则循环当前的 unkeyedNodesList
        // 取出每一个 unkeyedNode 并与 vnodeChild 作比较且优先匹配 vnodeChild 相同节点类型
        for (var j = 0; j < unkeyedNodesLen; j++) {
          var unkeyedNode = unkeyedNodesList[j];

          if (unkeyedNode && (0, _dom.isSameNodeType)(unkeyedNode, vnodeChild)) {
            child = unkeyedNode; // 配对成功，赋值 child

            unkeyedNodesList[j] = null; // 配对成功，清空元素 & GC
            // 如果是最后一个元素 则整体长度减一

            if (j === unkeyedNodesLen - 1) unkeyedNodesLen--; // 如果 j === 起始位置长度，则 startPosFlag 加一

            if (j === startPosFlag) startPosFlag++;
            break;
          }
        }
      } // Executes `diffNode(child, vnodeChild)` algorithm
      // 执行 diffNode，返回 diff 之后的真实 DOM 结构


      var newDomNode = diffNode(child, vnodeChild); // 原先存在于该 `index` 位置的 domChildNode

      var oldDomNode = domChildNodes[_i];
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
          dom.appendChild(newDomNode);
        } else if (newDomNode === oldDomNode.nextSibling) {
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
          (0, _dom.removeNode)(oldDomNode);
        } else {
          // 将更新后的节点移动到正确的位置
          // var insertedNode = parentNode.insertBefore(newNode, referenceNode);
          dom.insertBefore(newDomNode, oldDomNode);
        }
      }
    }
  }

  if (keyedLen) {
    for (var _key2 in keyedNodesMap) {
      if (keyedNodesMap[_key2]) {
        (0, _dom.recollectNodeTree)(keyedNodesMap[_key2], false);
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
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      var value = props[name];

      if (value) {
        (0, _dom.setAttribute)(dom, name, value);
      } else {
        if (dom.getAttribute(name)) {
          (0, _dom.setAttribute)(dom, name, undefined);
        }
      }
    }
  }
}
},{"./constants":"react-dom/constants.js","./component-helper":"react-dom/component-helper.js","./dom":"react-dom/dom.js"}],"react-dom/component-helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponent = createComponent;
exports.setComponentProps = setComponentProps;
exports.renderComponent = renderComponent;

var _component = _interopRequireDefault(require("../react/component"));

var _diff = require("./diff");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { renderVnode } from './render'
function createComponent(component, props) {
  // from preact?
  var inst;

  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    // Make a new instance of Component
    inst = new _component.default(props);
    inst.constructor = component;

    inst.render = function () {
      return this.constructor(props);
    };
  }

  return inst;
}

function setComponentProps(component, props) {
  // Not Mount, So execute componentWillMount
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;
  renderComponent(component);
}

function renderComponent(component) {
  var base; // Render component, just executes `React.createElement()` function.

  var renderer = component.render(); // If it be mounted before

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  base = (0, _diff.diffNode)(component.base, renderer);

  if (component.base) {
    // did update
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    // did mount
    component.componentDidMount();
  } // replace child


  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }

  component.base = base;
  base._component = component;
}
},{"../react/component":"react/component.js","./diff":"react-dom/diff.js"}],"react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _componentHelper = require("../react-dom/component-helper");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component =
/*#__PURE__*/
function () {
  // static isReactComponent = true
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.isReactComponent = true;
    this.state = {};
    this.props = props;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateOrFn, callback) {
      if (typeof stateOrFn === 'function') {
        var newState = stateOrFn();

        if (_typeof(newState) !== 'object') {
          throw new TypeError("this.setState((stateChange: Function) => object) must return an object!");
        } else {
          this.state = newState;
        }
      } else if (_typeof(stateOrFn) === 'object') {
        this.state = stateOrFn;
      } else {
        throw new TypeError("this.setState only accept 'function' or 'object', not this type ".concat(_typeof(stateOrFn)));
      }

      (0, _componentHelper.renderComponent)(this);
    }
  }, {
    key: "render",
    value: function render() {
      throw "Must implements render function.";
    }
  }]);

  return Component;
}();

exports.default = Component;
Object.defineProperty(Component, 'isReactComponent', {
  value: true,
  configurable: false,
  enumerable: false
});
},{"../react-dom/component-helper":"react-dom/component-helper.js"}],"react/create-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createElement;
var EMPTY_CHILDREN = [];
var stack = [];

function VNode() {}

function createElement(tag) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;

  for (i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  if (props && props.children != null) {
    if (!stack.length) stack.push(props.children);
    delete props.children;
  }

  while (stack.length) {
    // 弹出栈顶的 array 并且 push 每个到 stack
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }
    } else {
      if (typeof child === 'boolean') child = null;

      if (simple = typeof tag !== 'function') {
        if (child === null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
      } // hydrating string


      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children === EMPTY_CHILDREN) {
        children = [child];
      } else {
        children.push(child);
      }

      lastSimple = simple;
    }
  }

  var p = new VNode();
  p.tag = tag;
  p.children = children;
  p.props = props == null ? undefined : props;
  p.key = props == null ? undefined : props.key; // if a "vnode hook" is defined, pass every created VNode to it
  // preact
  // if (options.vnode !== undefined) options.vnode(p);

  return p;
}
},{}],"react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _component = _interopRequireDefault(require("./component"));

var _createElement = _interopRequireDefault(require("./create-element"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Component: _component.default,
  createElement: _createElement.default
};
exports.default = _default;
},{"./component":"react/component.js","./create-element":"react/create-element.js"}],"react-dom/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;
exports.renderVnode = renderVnode;

var _componentHelper = require("./component-helper");

var _dom = require("./dom");

var _diff = require("./diff");

var _constants = require("./constants");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * render
 * @param {String|VNode} vnode Virtual Node
 * @param {HTMLElement} container DOM Container
 */
function render(vnode, container, dom) {
  return (0, _diff.diff)(dom, vnode, container); // return container.appendChild(renderVnode(vnode))
}
/**
 * renderVnode
 * @param {String|VNode} vnode Virtual Node
 */


function renderVnode(vnode) {
  var dom; // Handle when vnode is one of `null`, `undefined` or `false`

  if (vnode === null || vnode === false || vnode === undefined) return; // TextNode

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (vnode === ' ') return;
    return dom = document.createTextNode(vnode);
  } // DOMElement


  if (_typeof(vnode) === 'object' && vnode.tag) {
    var tag = vnode.tag,
        _vnode$props = vnode.props,
        props = _vnode$props === void 0 ? {} : _vnode$props,
        children = vnode.children;

    if (typeof tag === 'function') {
      // Stateless Component & State Component
      var component = (0, _componentHelper.createComponent)(tag, props);
      (0, _componentHelper.setComponentProps)(component, props);
      return component.base;
    }

    dom = document.createElement(tag);

    if (props) {
      Object.keys(props).forEach(function (name) {
        (0, _dom.setAttribute)(dom, name, props[name]);
      });
    }

    if (children && children.length) {
      children.forEach(function (child) {
        dom.appendChild(renderVnode(child));
      });
    }

    return dom;
  }

  return dom;
}
},{"./component-helper":"react-dom/component-helper.js","./dom":"react-dom/dom.js","./diff":"react-dom/diff.js","./constants":"react-dom/constants.js"}],"react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  render: _render.default
};
exports.default = _default;
},{"./render":"react-dom/render.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("/react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import * as React from 'preact'
// console.log(React);
var list = [{
  content: '2'
}, {
  content: '1' // forward

}, {
  content: '4' // backward

}, {
  content: '3'
}, // 5 insert
{
  content: '6' // delete

}];

var List =
/*#__PURE__*/
function (_React$Component) {
  _inherits(List, _React$Component);

  function List(props) {
    var _this;

    _classCallCheck(this, List);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(List).call(this, props));
    _this.state = {
      list: list
    };
    return _this;
  } // 前移


  _createClass(List, [{
    key: "forward",
    value: function forward() {
      var ref1 = list[1];
      var ref2 = list[0];
      list[0] = ref1;
      list[1] = ref2;
      this.setState({
        list: list
      });
    } // 后移

  }, {
    key: "backward",
    value: function backward() {
      var ref1 = list[3];
      var ref2 = list[2];
      list[2] = ref1;
      list[3] = ref2;
      this.setState({
        list: list
      });
    } // 插入

  }, {
    key: "insert",
    value: function insert() {
      var ref = {
        content: 5
      };
      list.splice(4, 0, ref);
      this.setState({
        list: list
      });
    } // 追加

  }, {
    key: "append",
    value: function append() {
      list.push({
        content: 7
      });
      this.setState({
        list: list
      });
    } // 删除

  }, {
    key: "remove",
    value: function remove() {
      list.splice(6, 1);
      this.setState({
        list: list
      });
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "container"
      }, _react.default.createElement("ul", null, this.state.list.map(function (_ref) {
        var content = _ref.content;
        return _react.default.createElement("li", {
          key: content
        }, content);
      })), _react.default.createElement("div", {
        className: "buttons"
      }, _react.default.createElement("button", {
        onClick: this.forward.bind(this)
      }, "forward"), _react.default.createElement("button", {
        onClick: this.backward.bind(this)
      }, "backward"), _react.default.createElement("button", {
        onClick: this.insert.bind(this)
      }, "insert"), _react.default.createElement("button", {
        onClick: this.append.bind(this)
      }, "append"), _react.default.createElement("button", {
        onClick: this.remove.bind(this)
      }, "remove")));
    }
  }]);

  return List;
}(_react.default.Component);

var App =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return _react.default.createElement(List, null);
    }
  }]);

  return App;
}(_react.default.Component);

console.time('render');

_reactDom.default.render(_react.default.createElement(App, null), document.querySelector('#root'));

console.timeEnd('render');
console.log(_reactDom.default.render(_react.default.createElement(App, null)));
window.list = list;
window.React = _react.default;
window.ReactDOM = _reactDom.default;
},{"./react":"react/index.js","/react-dom":"react-dom/index.js"}],"../../../../.npm-global/bin/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53525" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../.npm-global/bin/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/weact.e31bb0bc.map