const BaseElement = require('base-element')
const xtend = require('xtend/mutable')
const inherits = require('inherits')

function ViewList (params) {
  var self = this
  if (!(self instanceof ViewList)) return new ViewList(params)
  params = params || {}
  BaseElement.call(self, params.appendTo || document.body)

  // Calculate height outside of the style.height
  function OnHeight() {}
  OnHeight.prototype.hook = function(node) {
    setTimeout(function() {
      self.height = node.offsetHeight
      self.send('load', node)
    }, 10)
  }

  // The last data rendered
  self._lastData = []

  xtend(this, {
    tagName: 'ul',
    childTagName: 'li',
    className: 'view-list',
    onHeight: new OnHeight(),
    onscroll: function () {
      self._scrollTop = this.scrollTop
      self.render(self._lastData)
      self.send('scroll', this)
    },
    eachrow: function (row) {
      return this.html(self.childTagName, {
        style: { height: self.rowHeight }
      }, [row])
    },
    height: 500,
    rowHeight: 30,
    _scrollTop: 0,
    _visibleStart: 0,
    _visibleEnd: 0,
    _displayStart: 0,
    _displayEnd: 0
  }, params)
}
inherits(ViewList, BaseElement)
module.exports = ViewList

// Calculate the view of the total data on scroll
ViewList.prototype._calculateScroll = function (data) {
  var total = data.length
  var rowsPerBody = Math.floor((this.height - 2) / this.rowHeight)
  this._visibleStart = Math.round(Math.floor(this._scrollTop / this.rowHeight))
  this._visibleEnd = Math.round(Math.min(this._visibleStart + rowsPerBody))
  this._displayStart = Math.round(Math.max(0, Math.floor(this._scrollTop / this.rowHeight) - rowsPerBody * 1.5))
  this._displayEnd = Math.round(Math.min(this._displayStart + 4 * rowsPerBody, total))
}

ViewList.prototype.render = function (data) {
  var self = this
  self._lastData = data
  self._calculateScroll(data)

  // Slice off rows and create elements for each
  var rows = data.slice(self._displayStart, self._displayEnd)
  rows = rows.map(function (row) {
    return self.eachrow.call(self, row)
  })

  // Calculate top row
  rows.unshift(self.html(self.childTagName, {
    className: 'top',
    style: {
      height: self._displayStart * self.rowHeight,
      padding: 0,
      margin: 0
    }
  }))

  // Calculate bottom row
  rows.push(self.html(self.childTagName, {
    className: 'bottom',
    style: {
      height: (data.length - self._displayEnd) * self.rowHeight,
      padding: 0,
      margin: 0
    }
  }))

  return self.afterRender(self.html(self.tagName, self, rows))
}

ViewList.prototype.css = function () {
  let tagName = this.tagName
  let childTagName = this.childTagName
  return this.attachCSS(`
    ${tagName} {
      margin: 0;
      padding: 0;
      overflow: auto;
    }
    ${tagName} ${childTagName} {
      list-style: none;
    }
  `)
}
