import PageProxy from "./lib/proxy"

App({
  globalData: {
    themeColor: '#4e8ce8',
    headerBtnPosi: {},
    systemInfo: {}
  },
  onLaunch() {
    // 拦截 Page
    Page = PageProxy(Page)

    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect()
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })

    wx.cloud.init({
      env: "prod-2gzbko445547872d"
    })

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                // 重启应用
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  }
})