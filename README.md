# view-list

A writable stream that builds an infinite scrolling virtual DOM list view.

## Example

View a live example displaying 200k rows: [http://shama.github.io/view-list](http://shama.github.io/view-list)

Render the ViewList using virtual-dom:

```js
var ViewList = require('view-list')

var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var createElement = require('virtual-dom/create-element')
var raf = require('raf')

// Create an instance of our view list
var viewlist = new ViewList()

// Main render function
function render () {
  return viewlist.render()
}

// Every second, write a new row
var i = 0
setInterval(function() {
  viewlist.write('row ' + i++)
}, 1000)

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
```

## API

### `var list = new ViewList(params)`

`params` can be (in addition to the `virtual-dom` parameters):

* `tagName`: The tag to use. Default `'ul'`.
* `childTagName`: The tag to use for child elements. Default `'li'`.
* `className`: The classes to use on main element. Default `'view-list'`.
* `height`: The total height of the container. Default `500`.
* `rowHeight`: The height of each row. Default `30`.
* `eachrow`: A function that gets called for each row to return a custom element per row. Default:

  ```
  function (row) {
    return h(this.childTagName, {
      style: {
        height: this.rowHeight
      }
    }, [row])
  }
  ```

# license
(c) 2015 Kyle Robinson Young. MIT License
