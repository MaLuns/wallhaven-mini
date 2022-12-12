import ConcreteFactory from "./lib/apis/index"
import { PageProxy } from "./lib/proxy/index"

App({
  globalData: {
    headerBtnPosi: <WechatMiniprogram.ClientRect>{},
    systemInfo: <WechatMiniprogram.SystemInfo>{}
  },
  $apis: ConcreteFactory.getInstance('CloudApi'),
  $toPx(num: number) {
    return this.globalData.systemInfo.windowWidth / 750 * num
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