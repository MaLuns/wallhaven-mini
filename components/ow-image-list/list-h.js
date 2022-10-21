const { byte, toTwoDimensionalArray } = require('../../lib/util')

Component({
  data: {
    list: []
  },
  properties: {
    height: 0
  },
  lifetimes: {
    created: function () {
      this.catchList = []
    },
  },
  methods: {
    add(imgs = [], reset = false) {
      if (reset) {
        this.catchList = imgs
        this.data.list = []
      } else {
        this.catchList.push(...imgs)
      }
      let height = this.data.height

      let newList = imgs.map(img => {
        return {
          id: img.id,
          path: img.path,
          original: img.thumbs.original,
          width: height * img.ratio,
          file_size_str: byte(img.file_size)
        }
      })

      this.setData({
        ['list[' + this.data.list.length + ']']: newList
      })
    },
    viewImage(e) {
      const { id } = e.target.dataset;

      let index = this.catchList.findIndex(item => item.id === id)
      let minIndex = Math.max(index - 20, 0)
      let maxIndex = Math.min(index + 20, this.catchList.length)

      let newList = this.catchList.slice(minIndex, maxIndex)
      let newIndex = index - minIndex;

      this.triggerEvent('click', {
        index: newIndex,
        list: newList
      })
    }
  }
})