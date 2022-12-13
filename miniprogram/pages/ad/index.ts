const app = getApp()

Page({
  data: {
    tips: app.$config.tips
  },
  onLoad() {
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 2000);
  }
})