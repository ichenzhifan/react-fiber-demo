
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

/**
 * 通过虚拟dom, 新建真实的dom.
 * @param {*} vdom 
 */
function createDom(vdom) {
  const dom = vdom.type === 'TEXT' ?
    document.createTextNode('') :
    document.createElement(vdom.type);

  Object.keys(vdom.props)
    .filter(key => key !== 'children')
    .forEach(name => {
      dom[name] = vdom.props[name];
    })
}

function render(vdom, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom]
    }
  };

  // vdom.props.children.forEach(child => {
  //   render(child, dom);
  // });

  // container.appendChild(dom);
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
  // fiber的数据结构
  // {
  //   dom: 真实的dom
  //   parent: 父亲
  //   child: 第一个子元素
  //   slibing: 兄弟元素
  // }

  // - 父 --> 子
  // - 子 --> 兄弟
  // - 子 --> 父
  
  if(!fiber.dom){
    // 不是入口.
    fiber.dom = createDom(fiber);
  }

  // 如果有父元素，就把当前的节点添加的父节点中.
  if(fiber.parent){
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 处理子元素的逻辑
  const elements = fiber.props.children;

  // 构建成fiber结构
  let index = 0;
  let prevSlibing = null;
  while(index < elements.length){
    let element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }

    // 子元素中的第一个元素, 设置为父fiber的child属性
    if(index === 0){
      fiber.child = newFiber;
    }else{
      // 其他的元素, 以他的兄弟元素的形式存在
      prevSlibing.slibing = newFiber;
    }
    prevSlibing = newFiber;
    index++;
  }

  // 查找下一个任务
  // 1. 先找子元素.
  if(fiber.child){
    return fiber.child;
  }

  // 2. 没有子元素, 就找兄弟元素
  let nextFiber = fiber;
  while(nextFiber){
    if(nextFiber.slibing){
      return nextFiber.slibing;
    }

    // 3. 没有兄弟元素, 就找父元素.
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop)

export default {
  createElement,
  render
};