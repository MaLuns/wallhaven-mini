// pages/view/index.js
Page({
  data: {
    src: ''
  },
  onLoad(options) {
    let { src } = options
    this.setData({
      src
    })
  },
  close() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})