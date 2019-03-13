function Observer(data) {
  this.data = data
  this.walk(data)
}

Observer.prototype = {
  walk: function(data) {
    var me = this
    Object.keys(data).forEach(function(key) {
      me.convert(data, key ,data[key])
    })
  },

  convert: function(data, key, value) {
    this.defineReactive(data, key, value)
  },

  defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      set: function() {

      },
      get: function() {

      }
    })
  }
}

function Observe(value) {
  if (!value || typeof value !== 'object') {
    return
  }
  return new Observer(value)
}

var uid = 0

function Dep() {
  this.id = uid++
  this.subs = []
}

Dep.prototype = {
  addSub: function() {
    this.subs.push()
  },

  depend: function() {
    Dep.target.addSub(this)
  },

  removeSub: function(sub) {
    var index = this.subs.indexOf(sub)
    if (index !== -1) {
      this.subs.splice(index, 1)
    }
  },

  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update()
    })
  }
}