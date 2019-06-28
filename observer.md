## 对数据的变动进行监听
```
function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key])
  })
}

function defineReactive(data, key, val) {
  observe(val)
  Object.defineProperty(data, key,{
    enumerable: true,
    configurable: false,
    get: function() {
      return val
    },
    set: function(newVal) {
      console.log('监听起作用了')
      val = newVal
    }
  })
}

var data  = {name: 'leejiahao'}
observe(data)
data.name = 'lijiahao'
```
## 添加消息队列

```
function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key])
  })
}

function defineReactive(data, key, val) {
  var dep = new Dep()
  observe(val)
  Object.defineProperty(data, key,{
    enumerable: true,
    configurable: false,
    get: function() {
      return val
    },
    set: function(newVal) {
      console.log('监听起作用了')
      val = newVal
      dep.notify()
    }
  })
}

function Dep() {
 this.subs = []
}

Dep.prototype = {
  addSub: function(sub) {
    this.subs.push()
  },
  notify: function(sub) {
    this.subs.forEach(function(sub) {
      sub.update()
    })
  }
}

var data  = {name: 'leejiahao'}
observe(data)
data.name = 'lijiahao'
```