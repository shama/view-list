var ViewList = require('./index.js')

var h = require('virtual-dom/h')
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var createElement = require('virtual-dom/create-element')
var raf = require('raf')

// Create a hook that starts the list at the bottom
var Onload = function () {}
Onload.prototype.hook = function (node, propertyName, previousValue) {
  setTimeout(function () {
    node.scrollTop = node.scrollHeight
  }, 0)
}

// Customize an instance of our view list
var viewlist = new ViewList({
  className: 'view-list',
  onload: new Onload(),
  eachrow: function (row) {
    return h(this.childTagName, {
      style: { height: this.rowHeight }
    }, [
      h('strong', [row.name + ': ']),
      row.message
    ])
  }
})

// Add some initial data to viewlist
var amt = 200000
for (var i = 0; i < amt; i++) {
  viewlist.write({
    name: 'user ' + parseInt(Math.random() * 9, 10),
    message: 'This is my message #' + i
  })
}

// Add a new row every 1s
setInterval(function() {
  viewlist.write({
    name: 'user ' + parseInt(Math.random() * 9, 10),
    message: 'This is my message #' + i++
  })
}, 1000)


// Our app render function
function render () {
  return h('div', [
    'With ' + i + ' rows:',
    viewlist.render()
  ])
}

// Initial DOM tree render
var tree = render()
var rootNode = createElement(tree)
document.body.appendChild(rootNode)

// Main render loop
raf(function tick () {
  var newTree = render()
  var patches = diff(tree, newTree)
  rootNode = patch(rootNode, patches)
  tree = newTree
  raf(tick)
})
