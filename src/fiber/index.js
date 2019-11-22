

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        // 将文本元素也换成对象的格式.
        return typeof child === 'object' ? child : createTextNode(child)
      })
    }
  }
}

/**
 * 创建一个文本元素
 * @param {String} text 
 */
function createTextNode(text) {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(vdom, container) {
  const dom = vdom.type === 'TEXT' ?
    document.createTextNode('') :
    document.createElement(vdom.type);

  Object.keys(vdom.props)
    .filter(key => key !== 'children')
    .forEach(name => {
      dom[name] = vdom.props[name];
    })

  vdom.props.children.forEach(child => {
    render(child, dom);
  });

  container.appendChild(dom);
}

export default {
  createElement,
  render
};