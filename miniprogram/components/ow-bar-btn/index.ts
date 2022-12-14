Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    btns: {
      type: Array,
      value: []
    }
  },
  methods: {
    handleClick(e: WechatMiniprogram.CustomEvent) {
      const btn = this.data.btns[e.currentTarget.dataset.index]
      if (btn.click) {
        const pages = getCurrentPages()
        btn.click.call(pages[pages.length - 1])
      } else {
        this.triggerEvent('click', btn)
      }
    }
  }
})
