## Vue 中组件的本质是什么

在传统页面开发中，我们使用 模板引擎 进行页面开发，

类似 lodash.template

```
import { template } from 'lodash'

const compiler = template('<h1><%= title %></h1>')
const html = compiler({ title: 'My Component' })

document.getElementById('app').innerHTML = html
```

模板引擎的概念是： 数据 + 模板 => HTML

我们可以看到 compiler ，接受的参数是 html 字符串，渲染出页面，似乎一个函数就是一个组件。


实际上在使用 Vue 或 React 开发时，他们的输出并不是 html 字符串，而是 **Virtual Dom**

数据 + 模板 => Virtual Dom

以 Vue 为例，一个组件的核心其实是 render 函数，其他内容，像 data、computed、props 都是为 render 函数提供服务的。
render 函数本可以直接生成 html 但却产出了 virtual dom， 借助 snabbdom 的 API 我们可以表达出这个公式。

```
import { h } from snabbdom

// h 函数用来创建 VNode，组件的产出是 VNode
const MyComponent = props => {
  return h('h1', props.title)
}
```
传统的开发中， 通过将模板引擎直接替换为 html， 
可是 virtual dom 毕竟无法直接渲染到浏览器中，把 virtual dom 渲染为 dom 的过程叫做 __patch__。

```
import { h, init } from 'snabbdom'
// init 方法用来创建 patch 函数
const patch = init([])

const MyComponent = props => {
  return h('h1', props.title)
}

// 组件的产出是 VNode
const prevVnode = MyComponent({ title: 'prev' })
// 将 VNode 渲染成真实 DOM
patch(document.getElementById('app'), prevVnode)
```

数据变更时，组件会产生新的 VNode， 只需要再次调用 patch

```
// 数据变更，产出新的 VNode
const nextVnode = MyComponent({ title: 'next' })
// 通过对比新旧 VNode，高效地渲染真实 DOM
patch(prevVnode, nextVnode)
```

另外说几点题外话： 为什么需要使用 virtual dom 

### 为什么要通过 virtual dom


曾经一度以为使用 virtual dom 的原因是因为操作 virtual dom 比操作 DOM 的速度快。但其实这是一种错误的认识。

看到 [尤雨溪:网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么](https://www.zhihu.com/question/31809713/answer/53544875) 这个答案的回答可以总结为这几点：

- 在比较性能的时候，要分清楚初始渲染、小量数据更新、大量数据更新这些不同的场合。
- 可以渲染到 DOM 以外的 backend，比如 ReactNative。
- 为函数式的 UI 编程方式打开了大门


本文参考：
[hcysun 组件的本质是什么](http://hcysun.me/vue-design/zh/essence-of-comp.html#%E7%BB%84%E4%BB%B6%E7%9A%84-vnode-%E5%A6%82%E4%BD%95%E8%A1%A8%E7%A4%BA)