import preview from '../../../lib/mixins/preview/index'
const app = getApp()

const typeMap = {
  favorites: {
    title: "我的收藏",
    data: () => app.$apis.getFavorites(),
    clear: () => app.$apis.deleteAllFavorite(),
    delete: (id: string) => app.$apis.deleteFavorite(id)
  },
  historys: {
    title: "我的足迹",
    data: () => app.$apis.getHistorys(),
    clear: () => app.$apis.deleteAllHistory(),
    delete: (id: string) => app.$apis.deleteHistory(id)
  },
}

Page({
  type: <CacheDataType>'favorites',
  behaviors: [preview],
  data: {
    show: false,
    title: "",
    btns: [
      {
        icon: "icon-lajitong",
        color: "#ff4e4e",
        click: function (this: WechatMiniprogram.Page.Instance<{}, { type: CacheDataType }>) {
          wx.showModal({
            title: '提示',
            content: '确定删除所有数据？',
            success: (res) => {
              if (res.confirm) {
                this.setData({
                  show: false
                })
                typeMap[this.type].clear()
              }
            }
          })
        },
      }
    ]
  },
  onLoad({ type = "favorites" }: { type: CacheDataType }) {
    this.type = type
    const count = app.$apis.getTotalUserData()

    this.setData({
      title: typeMap[type].title,
      show: count[type] > 0
    }, () => {
      if (this.data.show) {
        this.selectComponent("#image-list").add(typeMap[type].data(), false)
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
        typeMap[this.type].delete(item.id)
        this.selectComponent("#image-list").add(typeMap[this.type].data(), true, false)
      }
    })
  }
})