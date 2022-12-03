Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
  },
  methods: {
    onAfterLeave() {
      this.setData({
        show: false
      })
    },
  }
})
