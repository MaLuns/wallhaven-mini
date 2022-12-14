import ConcreteFactory from "./lib/apis/index"
import { PageProxy } from "./lib/proxy/index"
import config from "./lib/config"

App({
  globalData: {
    headerBtnPosi: <WechatMiniprogram.ClientRect>{},
    systemInfo: <WechatMiniprogram.SystemInfo>{}
  },
  /** 全局配置 */
  $config: config,
  /** Api 类 */
  $apis: ConcreteFactory.getInstance(config.apiVersion),
  /** 自定义导航信息 */
  $getCustomNavigationInfo(): CustomNavigationInfo {
    if (this.$_customNavigationInfo.statusBarHeight) return this.$_customNavigationInfo;

    const headerPosi = this.globalData.headerBtnPosi // 胶囊位置信息
    const statusBarHeight = Math.min(this.globalData.systemInfo.statusBarHeight, this.globalData.systemInfo.safeArea.top) // 状态栏高度
    const menuButtonWidth = (this.globalData.systemInfo.windowWidth - headerPosi.right) * 2 + headerPosi.width
    const navigateMaxWidth = this.globalData.systemInfo.windowWidth - menuButtonWidth
    const navigateTitleMaxWidth = this.globalData.systemInfo.windowWidth - menuButtonWidth * 2
    const navigateContentHeight = (headerPosi.top - statusBarHeight) * 2 + headerPosi.height

    this.$_customNavigationInfo = {
      statusBarHeight,
      menuButtonWidth,
      navigateMaxWidth,
      navigateTitleMaxWidth,
      navigateContentHeight,
      navBarSpaceHeight: statusBarHeight + navigateContentHeight
    }
    return this.$_customNavigationInfo;
  },
  $_customNavigationInfo: <CustomNavigationInfo>{},
  /** rpx to px */
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