Component({
  data: {
    show: false
  },
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