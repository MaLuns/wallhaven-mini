import { tabbars } from "./util";

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    show: true,
    selected: 0,
    tabbars
  },
  methods: {
    handleClick(e: WechatMiniprogram.BaseEvent) {
      let path = e.currentTarget.dataset.path;
      wx.switchTab({ url: path })
    }
  }
})