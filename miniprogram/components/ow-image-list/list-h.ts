import { byte } from '../../lib/util'
const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    catchList: [] as Array<ImageItem>,
    list: [] as Array<Array<ImageItem>>,
    targetStatus: 0 as ScrolStatus
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
    handleViewImage(e: WechatMiniprogram.BaseEvent) {
      const { id } = e.target.dataset;

      const index = this.data.catchList.findIndex(item => item.id === id)
      const minIndex = Math.max(index - 24, 0)
      const maxIndex = Math.min(index + 24, this.data.catchList.length)

      const newList = this.data.catchList.slice(minIndex, maxIndex)
      const newIndex = index - minIndex;

      this.triggerEvent('click', {
        index: newIndex,
        list: newList
      })
    },
    handleScroll(e: WechatMiniprogram.ScrollViewScroll) {
      if (this.data.list.length === 0) return;

      const { scrollLeft, scrollWidth } = e.detail
      const scroll = scrollLeft + app.globalData.systemInfo.screenWidth - scrollWidth
      let targetStatus = 0

      if (scroll > 80) {
        targetStatus = 2
      } else if (scroll > 40) {
        targetStatus = 1
      } else {
        targetStatus = 0
      }

      if (targetStatus !== this.data.targetStatus) {
        this.setData({
          targetStatus
        })
      }
    },
    handleDragend() {
      if (this.data.targetStatus === 2) {
        this.triggerEvent('load')
      }
    },
    // 长按 收藏
    handleLongPress(e: WechatMiniprogram.BaseEvent) {
      const id: string = e.target.dataset.id;
      const item = this.data.catchList.find(item => item.id === id)
      this.triggerEvent('long', item)
      /* const that = this

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