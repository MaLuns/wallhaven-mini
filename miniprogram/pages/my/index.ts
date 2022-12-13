const app = getApp()

Page({
  data: {
    v: 'v1.0.5',
    date: '2022/12/13',
    favorites: 0,
    historys: 0,
  },
  onShow() {
    let { favorites, historys } = app.$apis.getTotalUserData() as TotalUserData
    this.setData({
      favorites,
      historys
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