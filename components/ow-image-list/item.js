Component({
  options: {
    virtualHost: true
  },
  properties: {
    image: {
      type: Object,
      value: () => ({
        id: '',
        path: '',
        original: '',
        file_size_str: '',
      })
    },
    showInfo: {
      type: Boolean,
      value: true
    },
    type: {
      type: String,
      value: ''
    },
    height: {
      optionalTypes: [String, Number],
      value: '100%'
    },
    width: {
      optionalTypes: [String, Number],
      value: '100%'
    }
  }
})