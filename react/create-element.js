const EMPTY_CHILDREN = []
const stack = []
function VNode() {}


export default function createElement(tag, props = {}) {
  let children = EMPTY_CHILDREN, lastSimple, child, simple, i;

	for (i=arguments.length; i-- > 2; ) {
		stack.push(arguments[i]);
  }

	if (props && props.children != null) {
		if (!stack.length) stack.push(props.children);
		delete props.children;
  }

	while (stack.length) {
    // 弹出栈顶的 array 并且 push 每个到 stack
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--; ) stack.push(child[i]);
		}
		else {
			if (typeof child === 'boolean') child = null;

			if ((simple = typeof tag !== 'function')) {
				if (child === null) child = '';
				else if (typeof child === 'number') child = String(child);
				else if (typeof child !== 'string') simple = false;
			}

      // hydrating string
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

  let p = new VNode();

	p.tag = tag;
	p.children = children;
	p.props = props == null ? undefined : props;
	p.key = props == null ? undefined : props.key;

  // if a "vnode hook" is defined, pass every created VNode to it
  // preact
	// if (options.vnode !== undefined) options.vnode(p);

	return p;
}