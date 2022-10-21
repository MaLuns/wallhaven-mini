const { byte, toTwoDimensionalArray } = require('../../lib/util')

Component({
  data: {
    list: [
      [],
      [],
      []
    ],
    width: (750 - 4 * 20) / 3
  },
  properties: {
    count: {
      type: Number,
      value: 3
    }
  },
  observers: {
    'count': function (count) {
      this.init(count)
      this.setData({
        width: (750 - (count + 1) * 20) / 3
      })
    }
  },
  lifetimes: {
    created: function () {
      this.catchList = []
      this.sumHeight = [0, 0, 0]
    },
  },
  methods: {
    init(count) {
      this.catchList = []
      this.sumHeight = toTwoDimensionalArray(count, 0)
      this.setData({
        list: toTwoDimensionalArray(count)
      })
    },
    add(imgs = [], reset = false) {
      // 重置数据
      if (reset) this.init(this.data.count);

      const { data: { width, list }, sumHeight } = this
      this.catchList = [...this.catchList, ...imgs]

      const minValIndex = (arr = []) => {
        let val = Math.min(...arr);
        return arr.findIndex(i => i === val)
      }

      // 生成新列表
      const newList = toTwoDimensionalArray(this.data.count)
      imgs.forEach(img => {
        img.file_size_str = byte(img.file_size)
        img.height = width / img.ratio;
        img.original = img.thumbs.original

        let minIndex = minValIndex(sumHeight)
        sumHeight[minIndex] = sumHeight[minIndex] + img.height;

        newList[minIndex].push({
          id: img.id,
          path: img.path,
          original: img.thumbs.original,
          height: width / img.ratio,
          file_size_str: byte(img.file_size)
        })
      })

      // 动态更新二维下标
      let updateObj = {}
      list.forEach((item, index) => {
        let len = item.length
        updateObj[`list[${index}][${len}]`] = newList[index]
      })

      this.setData(updateObj, () => {
        this.sumHeight = sumHeight
        if (reset)
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0,
          })
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