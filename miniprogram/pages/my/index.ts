import { changeTab } from '../../custom-tab-bar/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow() {
    changeTab.call(this)
  },
})