官方文档对如何开发一个插件的解释

>Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象：

```
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

也就是说Vue.use会接收一个包含install方法的对象,我们看看vue代码中具体的实现，看看究竟发生了什么。

```
/* @flow */

function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}


export function initUse(Vue: GlobalAPI) {
  Vue.use = function(plugin: Function | Object) {
    <!-- 判断这个插件是否存在，如果存在返回vue对象 -->
    const installedPlugins = this._installedPlugins || (this._installedPlugins = [])
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // toArray接收一个 Vue.use的argumenys类数组，并且会把plugin去掉
    const args = toArray(arguments, 1)

    // 把vue对象放在args数组的第一个位置 []
    args.unshift(this)

    // 如果plugin对象中的install方法是一个函数， 那么 使用 plugin 的上下文 去执行plugin.install 方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    // 如果plugin就是一个函数的话 那么直接执行plugin
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
  
    installedPlugins.push(plugin)
    // 返回Vue对象
    return this
  }
}

```

toArray方法是将一个array-like函数转换为array, 接收两个参数第一个参数是一个array-like对象(arguments), 第二个参数是从第n-1位开始取值。
类似于 [].slice.call(aguments), 不过使用这种方式会影响某些浏览器的性能优化。
```
var arr = {
  "a": 1,
  "b": 2,
  "c": 3
  length: 3
}
toArray(arr) // [3,2,1]
toArray(arr, 1) // [1]
```

args.unshift(this) 把Vue对象放在数组的第一位。

plugin.install.apply(plugin, args) 使用plugin的上下文去执行plugin中的install方法，参数为vue和use中的其他对象。

如果plugin对象中没有install函数，他本身就是一个函数时那么直接执行plugin, 参数为vue对象和调用use时的其他参数。


我们可以对Vue.use方法做一个简单的抽象

```

function toArray(list, start) {
  start = start || 0
  var i = list.length - start
  const ret = new Array(i)
  while(i--) {
    ret[i] = list[i+start]
  }
  return ret
}


function Vue() {}

Vue.use = function(plugin) {

  const args = toArray(arguments, 1)
  args.unshift(this)

  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }

  return this
}


var obj = {
  install(Vue, a, b, c) {
    console.log(a, b, c)
  }
}

Vue.use(obj, 1, 2, 3)

```