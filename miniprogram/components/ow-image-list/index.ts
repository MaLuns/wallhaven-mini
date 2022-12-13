import { byte, toTwoDimensionalArray } from '../../lib/util'

Component({
  data: {
    catchList: [] as Array<ImageItem>,
    sumHeight: [0, 0, 0] as Array<number>,
    list: [
      [],
      [],
      []
    ] as Array<Array<ImageItem>>,
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
      this.data.list = toTwoDimensionalArray(count)
    },
    /**
     * 添加列表数据
     * @param imgs 壁纸列表
     * @param reset 是否重置
     * @param isScroll 是否滚动
     */
    add(imgs: Array<ImageItem> = [], reset = false, isScroll = reset) {
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

      this.data.sumHeight = sumHeight

      if (reset) {
        list.forEach((item, index) => {
          list[index][item.length] = newList[index]
        })
        this.setData({ list }, () => {
          if (isScroll)
            wx.pageScrollTo({ scrollTop: 0, duration: 0, })
        })
      } else {
        // 动态更新二维下标
        let updateObj: { [key: string]: Array<ImageItem> } = {}
        list.forEach((item, index) => {
          updateObj[`list[${index}][${item.length}]`] = newList[index]
        })

        this.setData(updateObj)
      }
    },
    // 点击预览
    handleViewImage(e: WechatMiniprogram.BaseEvent) {
      const id: string = e.target.dataset.id;

      const index = this.data.catchList.findIndex(item => item.id === id)
      const minIndex = Math.max(index - 20, 0)
      const maxIndex = Math.min(index + 20, this.data.catchList.length)

      const newList = this.data.catchList.slice(minIndex, maxIndex)
      const newIndex = index - minIndex;

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
    }
  }
})