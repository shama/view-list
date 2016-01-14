# view-list [![Build Status](http://img.shields.io/travis/shama/view-list.svg)](https://travis-ci.org/shama/view-list)

An infinite scrolling list view element built on a virtual DOM.

## Example

View a live example displaying 200k rows: [http://shama.github.io/view-list](http://shama.github.io/view-list)

Render the ViewList using virtual-dom:

```js
var ViewList = require('view-list')

// Create an instance of our view list in document.body
var viewlist = new ViewList({
  appendTo: document.body
})

// Create some data to add to the list
var data = ['one', 'two', 'three']

// Render the data
viewlist.render(data)

// Listen for scroll events coming up
viewlist.addEventListener('scroll', function (element) {
  console.log('List was scrolled to ' + element.scrollTop)
})

// Every second, append a new row
var i = 0
setInterval(function() {
  data.push('row ' + i++)
  viewlist.render(data)
}, 1000)
```

## API

### `var list = new ViewList(params)`

`params` can be (in addition to the `virtual-dom` parameters):

* `tagName`: The tag to use. Default `'ul'`.
* `childTagName`: The tag to use for child elements. Default `'li'`.
* `className`: The classes to use on main element. Default `'view-list'`.
* `topClassName`: The classes to use on top element. Default `'.top'`.
* `bottomClassName`: The classes to use on bottom element. Default `'.bottom'`.
* `element`: The DOM element of the list.
* `height`: The total height of the container. Default `500`.
* `rowHeight`: The height of each row. Default `30`.
* `eachrow`: A function that gets called for each row to return a custom element per row. Default:

  ```
  function (row) {
    return this.html(this.childTagName, {
      style: {
        height: this.rowHeight
      }
    }, [row])
  }
  ```

#### Events

Listen for events with `list.addEventListener(name, function () {})`.

* `load`: Called when element has loaded.
* `scroll`: Called when element has been scrolled.

# license
(c) 2016 Kyle Robinson Young. MIT License
