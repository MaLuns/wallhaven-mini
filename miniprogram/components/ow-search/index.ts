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
    showTabBar() {
      const bar = this.getTabBar()
      if (bar) {
        bar.setData({
          show: this.data.show
        })
      }
    },
    changeSearchPlan() {
      this.showTabBar()
      this.setData({
        show: !this.data.show
      })
    },
    onSearch() {
      wx.vibrateShort({ type: 'heavy' })
      this.showTabBar()
      this.setData({ show: false })
      this.triggerEvent('search')
    }
  }
})