Component({
  options: {
    virtualHost: true
  },
  properties: {
    image: {
      type: Object,
      value: () => ({
        thumbs: {}
      })
    },
    showInfo: {
      type: Boolean,
      value: true
    },
    type: '',
    height: {
      optionalTypes: [String, Number],
      value: '100%'
    },
    width: {
      optionalTypes: [String, Number],
      value: '100%'
    }
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