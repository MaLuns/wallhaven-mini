
Page({
  onLoad() {
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 2000);
  }
})