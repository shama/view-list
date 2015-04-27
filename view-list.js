var h = require('virtual-dom/h')
var xtend = require('xtend/mutable')

function ViewList (params) {
  if (!(this instanceof ViewList)) return new ViewList(params)
  var self = this
  Object.defineProperty(this, 'height', {
    get: function() {
      return this.style.height || 0
    },
    set: function(val) {
      this.style.height = val || 0
    }
  })
  xtend(this, {
    tagName: 'ul',
    childTagName: 'li',
    className: 'view-list',
    data: [],
    onscroll: function () {
      self._scrollTop = this.scrollTop
    },
    eachrow: function (row) {
      return h(this.childTagName, {
        style: {
          height: this.rowHeight
        }
      }, [row])
    },
    rowHeight: 30,
    style: {
      height: 500,
      overflow: 'auto'
    },
    _scrollTop: 0,
    _visibleStart: 0,
    _visibleEnd: 0,
    _displayStart: 0,
    _displayEnd: 0
  }, params)
}
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

  this._calculateScroll(data)

  // Slice off rows and create elements for each
  var rows = data.slice(this._displayStart, this._displayEnd)
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
      height: (data.length - this._displayEnd) * this.rowHeight,
      padding: 0,
      margin: 0
    }
  }))

  return h(self.tagName, this, rows)
}
