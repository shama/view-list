var ViewList = require('./index.js')
var through = require('through2')
var debounce = require('lodash.debounce')
var style

// Create an instance of our view list
var viewlist = new ViewList({
  className: 'view-list',
  eachrow: function (row) {
    return this.html('li', [
      this.html('strong', row.name + ': '),
      row.message
    ])
  }
})

// On load scroll to the bottom
viewlist.on('load', function (node) {
  node.scrollTop = node.scrollHeight
})

// Create a throttled render function as this is being put into
// on('data') for convenience but we dont want to render every time
var render = debounce(function () {
  viewlist.render.apply(viewlist, arguments)
  if (!style) {
    // Create an inline stylesheet (should be nonce'd or written out but this is quick)
    style = document.createElement('style')
    style.innerHTML = viewlist.css()
    document.head.appendChild(style)
  }
}, 100)

// Our data model can be a stream
var all = []
var model = through.obj(function (chunk, enc, cb) {
  chunk.name += parseInt(Math.random() * 9, 10)
  this.push(chunk)
  cb()
})
model.on('data', function (data) {
  all.push(data)
  render(all)
})

// Add some initial data to viewlist
var amt = 2000
for (var i = 0; i < amt; i++) {
  model.write({
    name: 'user ',
    message: 'This is my message #' + i
  })
}

// Every 1s push a write a new record
setInterval(function () {
  model.write({
    name: 'user ',
    message: 'This is my message #' + i++
  })
}, 1000)
