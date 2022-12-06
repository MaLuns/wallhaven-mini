import createCacheData from "../../lib/catchData"

Page({
  data: {
    v: 'v1.0.4',
    date: '2022/11/27',
    favorites: 0,
    historys: 0,
  },
  onShow() {
    let keys = ['favorites', 'historys']

    keys.forEach(key => {
      this.setData({
        [key]: createCacheData(key).count()
      })
    })
  },
  // 打开收藏和历史记录
  handleNav(e: WechatMiniprogram.CustomEvent) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: "/pages/my/list/index?type=" + type
    })
  },
  // 打赏码
  handleTipMoney() {
    wx.previewImage({
      urls: ["/images/pay.jpg"]
    })
  },
  // 复制
  handleCopyText(e: WechatMiniprogram.CustomEvent) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: () => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  }
})