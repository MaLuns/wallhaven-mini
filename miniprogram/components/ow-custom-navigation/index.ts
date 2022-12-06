const app = getApp();

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 是否显示返回键
    showBack: {
      type: Boolean,
      value: false
    },
    // 高斯模糊
    blur: {
      type: Boolean,
      value: false
    },
    // 背景色
    backgroundColor: {
      type: String,
      value: "#fff"
    },
    // 字体色
    color: {
      type: String,
      value: "#000"
    },
    // 层级
    zIndex: {
      type: Number,
      value: 800
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
  },
  methods: {
    handleClose() {
      this.triggerEvent('close')
    }
  }
})

