const { byte, toTwoDimensionalArray } = require('../../lib/util')

Component({
  data: {
    catchList: [] as Array<ImageItem>,
    list: [] as Array<Array<ImageItem>>
  },
  properties: {
    height: {
      type: Number,
      value: 0
    }
  },
  methods: {
    add(imgs: Array<ImageItem> = [], reset = false) {
      if (reset) {
        this.data.catchList = imgs
        this.data.list = []
      } else {
        this.data.catchList.push(...imgs)
      }

      let height = this.data.height

      let newList = imgs.map(img => {
        return {
          id: img.id,
          path: img.path,
          original: img.thumbs.original,
          width: height * parseFloat(img.ratio),
          file_size_str: byte(img.file_size)
        }
      })

      this.setData({
        ['list[' + this.data.list.length + ']']: newList
      })
    },
    viewImage(e: { target: { dataset: { id: string } } }) {
      const { id } = e.target.dataset;

      let index = this.data.catchList.findIndex(item => item.id === id)
      let minIndex = Math.max(index - 20, 0)
      let maxIndex = Math.min(index + 20, this.data.catchList.length)

      let newList = this.data.catchList.slice(minIndex, maxIndex)
      let newIndex = index - minIndex;

      this.triggerEvent('click', {
        index: newIndex,
        list: newList
      })
    }
  }
})