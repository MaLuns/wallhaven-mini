Component({
  options: {
    addGlobalClass: true
  },
  data: {
    show: true
  },
  properties: {
    btns: {
      type: Array,
      value: []
    }
  },
  methods: {
    handleClick(e: WechatMiniprogram.CustomEvent) {
      let btn = this.data.btns[e.currentTarget.dataset.index]
      if (btn.click) {
        let pages = getCurrentPages()
        btn.click.call(pages[pages.length - 1])
      }
    }
  }
})
