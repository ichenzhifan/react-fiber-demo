import React from './fiber';

const App = <div id="box">
  <h1>hi</h1>
  <p>world</p>
  <a href="https://www.baidu.com">baidu</a>
</div>

React.render(
  App,
  document.querySelector('#app')
);
