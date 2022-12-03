Component({
  options: {
    addGlobalClass: true
  },
  data: {
    show: false
  },
  properties: {
    btn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    changeSearchPlan() {
      const bar = this.getTabBar()
      if (bar) {
        bar.setData({
          show: this.data.show
        })
      }
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