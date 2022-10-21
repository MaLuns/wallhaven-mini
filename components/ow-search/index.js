// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeSearchPlan() {
      this.setData({
        show: !this.data.show
      })
    },
    onSearch() {
      this.setData({
        show: false
      })
      wx.vibrateShort({
        type: 'heavy',
      })
      this.triggerEvent('search')
    }
  }
})