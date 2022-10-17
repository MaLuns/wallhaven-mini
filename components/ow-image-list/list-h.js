Component({
  properties: {
    list: {
      type: Array,
      value: () => []
    },
    height: 0
  },
  methods: {
    viewImage: function (e) {
      const { idx } = e.target.dataset;
      this.triggerEvent('click', { idx })
    }
  }
})