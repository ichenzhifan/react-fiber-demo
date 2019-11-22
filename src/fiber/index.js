
// 下一个单元任务
// render函数中初始化第一个任务.
let nextUnitOfWork = null;

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

/**
 * 调度我们的渲染或diff任务
 * @param {*} deadline 
 */
function workLoop(deadline) {
  // 有下一个任务, 并且当前的帧还没有结束
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  requestIdleCallback(workLoop);
}

/**
 * 根据当前的任务, 获取下一个任务.
 * @param {*} fiber 
 */
function performUnitOfWork(fiber) {

}

requestIdleCallback(workLoop)

export default {
  createElement,
  render
};