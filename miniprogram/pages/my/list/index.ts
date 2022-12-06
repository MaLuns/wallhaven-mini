import createCacheData from '../../../lib/catchData'
import preview from '../../../lib/mixins/preview/index'

const dataType = {
  favorites: "我的收藏",
  historys: "我的足迹",
}

Page({
  type: '',
  behaviors: [preview],
  data: {
    show: false,
    title: "",
    btns: [
      {
        icon: "icon-lajitong",
        color: "#ff4e4e",
        click: function (this: WechatMiniprogram.Page.Instance<{}, { type: string }>) {
          wx.showModal({
            title: '提示',
            content: '确定删除所有数据？',
            success: (res) => {
              if (res.confirm) {
                this.setData({
                  show: false
                })
                const cacheData = createCacheData(this.type)
                cacheData.clearSync()
              }
            }
          })
        },
      }
    ]
  },
  onLoad({ type = '' }) {
    const title = dataType[type as keyof typeof dataType]
    const cacheData = createCacheData(type)
    this.type = type
    this.setData({
      title,
      show: cacheData.count() > 0
    }, () => {
      if (this.data.show) {
        this.selectComponent("#image-list").add(cacheData.getDataAllSync(), false)
      }
    })
  },
  handleBack() {
    wx.navigateBack({})
  },
  handleLong(e: WechatMiniprogram.CustomEvent) {
    wx.showActionSheet({
      alertText: "提示",
      itemList: ['删除'],
      itemColor: "#f00",
      success: () => {
        let item = e.detail as ImageItem;
        const cacheData = createCacheData(this.type)
        cacheData.deleteDataSync(item.id)
        this.selectComponent("#image-list").add(cacheData.getDataAllSync(), true)
      }
    })
  }
})