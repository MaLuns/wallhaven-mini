import { byte, toTwoDimensionalArray } from '../../lib/util'

Component({
  data: {
    catchList: [] as Array<ImageItem>,
    sumHeight: [0, 0, 0] as Array<number>,
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
  methods: {
    init(count: number) {
      this.data.catchList = []
      this.data.sumHeight = toTwoDimensionalArray(count, 0)
      this.setData({
        list: toTwoDimensionalArray(count)
      })
    },
    add(imgs: Array<ImageItem> = [], reset = false) {
      // 重置数据
      if (reset) this.init(this.data.count);

      const { width, list, sumHeight } = this.data

      this.data.catchList = [...this.data.catchList, ...imgs]

      const minValIndex = (arr: Array<number> = []) => {
        let val = Math.min(...arr);
        return arr.findIndex(i => i === val)
      }

      // 生成新列表
      const newList = toTwoDimensionalArray(this.data.count)
      imgs.forEach(img => {
        img.file_size_str = byte(img.file_size)
        img.height = width / parseFloat(img.ratio);
        img.original = img.thumbs.original

        let minIndex = minValIndex(sumHeight)
        sumHeight[minIndex] = sumHeight[minIndex] + img.height;

        newList[minIndex].push({
          id: img.id,
          path: img.path,
          original: img.thumbs.original,
          height: width / parseFloat(img.ratio),
          file_size_str: byte(img.file_size)
        })
      })

      // 动态更新二维下标
      let updateObj: { [key: string]: Array<ImageItem> } = {}
      list.forEach((item, index) => {
        let len = item.length
        updateObj[`list[${index}][${len}]`] = newList[index]
      })

      this.setData(updateObj, () => {
        this.data.sumHeight = sumHeight
        if (reset)
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0,
          })
      })
    },
    // 点击预览
    handleViewImage(e: WechatMiniprogram.BaseEvent) {
      const id: string = e.target.dataset.id;

      let index = this.data.catchList.findIndex(item => item.id === id)
      let minIndex = Math.max(index - 20, 0)
      let maxIndex = Math.min(index + 20, this.data.catchList.length)

      let newList = this.data.catchList.slice(minIndex, maxIndex)
      let newIndex = index - minIndex;

      this.triggerEvent('click', {
        index: newIndex,
        list: newList
      })
    },
    // 长按 收藏
    handleLongPress(e: WechatMiniprogram.BaseEvent) {
      const id: string = e.target.dataset.id;
      const item = this.data.catchList.find(item => item.id === id)
      this.triggerEvent('long', item)

      /*
      const that = this
      wx.vibrateShort({ type: 'heavy' })
      wx.getStorage({
        key: 'favorites',
        success(res) {
          let favorites = res.data

          if (favorites[id]) {
            delete favorites[id]

            wx.setStorage({
              key: 'favorites',
              data: favorites
            })

            toast.warning({
              message: '取消收藏',
              context: that
            })
          } else {
            wx.setStorage({
              key: 'favorites',
              data: {
                ...favorites,
                [id]: item
              }
            })
            toast.success({
              message: '收藏成功',
              context: that
            })
          }
        },
        fail() {
          toast.success({
            message: '收藏成功',
            context: that
          })

          wx.setStorage({
            key: 'favorites',
            data: {
              [id]: item
            }
          })
        }
      }) */
    }
  }
})