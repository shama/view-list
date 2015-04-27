var h = require('virtual-dom/h')
var xtend = require('xtend/mutable')
var inherits = require('inherits')
var Writable = require('stream').Writable

function ViewList (params) {
  if (!(this instanceof ViewList)) return new ViewList(params)
  Writable.call(this, { objectMode: true })
  var self = this

  // Calculate height outside of the style.height
  function OnHeight() {}
  OnHeight.prototype.hook = function(node) {
    setTimeout(function() {
      self.height = node.offsetHeight
    }, 10)
  }

  // All the data displayed in the view
  this._data = []

  xtend(this, {
    target: null,
    tagName: 'ul',
    childTagName: 'li',
    className: 'view-list',
    onHeight: new OnHeight(),
    onscroll: function () {
      self._scrollTop = this.scrollTop
      if (self.target && typeof self.target.emit === 'function') {
        self.target.emit('scroll', this)
      }
    },
    eachrow: function (row) {
      return h(this.childTagName, {
        style: {
          height: this.rowHeight
        }
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
inherits(ViewList, Writable)
module.exports = ViewList

// Calculate the view of the total data on scroll
ViewList.prototype._calculateScroll = function () {
  var total = this._data.length
  var rowsPerBody = Math.floor((this.height - 2) / this.rowHeight)
  this._visibleStart = Math.round(Math.floor(this._scrollTop / this.rowHeight))
  this._visibleEnd = Math.round(Math.min(this._visibleStart + rowsPerBody))
  this._displayStart = Math.round(Math.max(0, Math.floor(this._scrollTop / this.rowHeight) - rowsPerBody * 1.5))
  this._displayEnd = Math.round(Math.min(this._displayStart + 4 * rowsPerBody, total))
}

ViewList.prototype._write = function (chunk, enc, cb) {
  this._data.push(chunk)
  cb()
}

ViewList.prototype.render = function (data) {
  var self = this

  // If data passed into render, replace all data with it
  // as they are not using streams
  if (data) this._data = data

  this._calculateScroll()

  // Slice off rows and create elements for each
  var rows = this._data.slice(this._displayStart, this._displayEnd)
  rows = rows.map(function (row) {
    return self.eachrow.call(self, row)
  })

  // Calculate top row
  rows.unshift(h(self.childTagName, {
    className: 'top',
    style: {
      height: this._displayStart * this.rowHeight,
      padding: 0,
      margin: 0
    }
  }))

  // Calculate bottom row
  rows.push(h(self.childTagName, {
    className: 'bottom',
    style: {
      height: (this._data.length - this._displayEnd) * this.rowHeight,
      padding: 0,
      margin: 0
    }
  }))

  return h(self.tagName, this, rows)
}
