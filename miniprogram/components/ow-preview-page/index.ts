Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },
  methods: {
    handleClose() {
      this.setData({
        show: false
      })
    },
    handleAfterLeave() {
      this.setData({
        show: false
      })
    },
  }
})
