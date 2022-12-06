import { tabbars, changeTab } from "./util";

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    show: true,
    selected: -1,
    tabbars
  },
  methods: {
    handleClick(e: WechatMiniprogram.BaseEvent) {
      let path = e.currentTarget.dataset.path;
      wx.switchTab({ url: path })
    }
  },
  lifetimes: {
    ready() {
      let index = changeTab.call(getCurrentPages()[0])
      if (index > -1) {
        this.setData({
          selected: index
        })
      }
    },
  }
})