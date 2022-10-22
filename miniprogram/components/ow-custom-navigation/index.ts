const app = getApp();

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    }, //标题
    backUrl: {
      type: String,
      value: ""
    }, //返回键跳转地址
    homeUrl: {
      type: String,
      value: ""
    }, //首页跳转地址
    showBack: {
      type: Boolean,
      value: false
    }, //是否显示返回键
    blur: {
      type: Boolean,
      value: false
    },
    backgroundColor: {
      type: String,
      value: "#fff"
    } //背景色
    ,
    color: {
      type: String,
      value: "#000"
    },
    isblock: {
      type: Boolean,
      value: true
    }
  },
  data: {
    statusBarHeight: 24,
    navigateTitleMaxWidth: 0,
    fontSizeSetting: 0,
    navigateContentHeight: 0,
    navBarSpaceHeight: 0
  },
  attached: function () {
    const headerPosi = app.globalData.headerBtnPosi // 胶囊位置信息
    let navigateTitleMaxWidth = 0
    const statusBarHeight = app.globalData.systemInfo.statusBarHeight // 状态栏高度
    navigateTitleMaxWidth = app.globalData.systemInfo.windowWidth - (app.globalData.systemInfo.windowWidth - headerPosi.left + 15) * 2
    this.setData({
      statusBarHeight: statusBarHeight,
      navigateContentHeight: (headerPosi.top - statusBarHeight) * 2 + headerPosi.height,
      navigateTitleMaxWidth: navigateTitleMaxWidth
    }, () => {
      this.setData({
        navBarSpaceHeight: this.data.statusBarHeight + this.data.navigateContentHeight
      })
    })
  }
})

