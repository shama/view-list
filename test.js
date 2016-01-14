var test = require('tape')
var ViewList = require('./index.js')

test('renders rows', function (t) {
  t.plan(3)
  var fixture = setup()
  var viewlist = new ViewList({ appendTo: fixture })
  viewlist.render(['one', 'two', 'three'])
  t.ok(fixture.querySelector('.top'), 'rendered a top row')
  t.ok(fixture.querySelector('.bottom'), 'rendered a bottom row')
  t.equal(fixture.querySelectorAll('li').length, 5, 'rendered 5 li tags')
  teardown(fixture)
  t.end()
})

function setup () {
  var fixture = document.createElement('div')
  document.body.appendChild(fixture)
  return fixture
}

function teardown (fixture) {
  fixture.parentNode.removeChild(fixture)
}
