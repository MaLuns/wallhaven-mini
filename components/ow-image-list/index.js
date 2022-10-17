Component({
  properties: {
    list: {
      type: Array,
      value: () => []
    },
    width: 0
  },
  methods: {
    viewImage: function (e) {
      const {
        src,
        idx
      } = e.target.dataset;

      this.triggerEvent('click', {
        src,
        idx
      })
    }
  }
})