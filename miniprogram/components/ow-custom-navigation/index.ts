const app = getApp();

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    // 标题
    title: {
      type: String,
      value: ''
    },
    // 是否显示返回键
    showBack: {
      type: Boolean,
      value: false
    },
    // 高斯模糊
    blur: {
      type: Boolean,
      value: false
    },
    // 背景色
    backgroundColor: {
      type: String,
      value: "#fff"
    },
    // 字体色
    color: {
      type: String,
      value: "#000"
    },
    // 层级
    zIndex: {
      type: Number,
      value: 800
    },
    isblock: {
      type: Boolean,
      value: true
    }
  },
  data: {
    statusBarHeight: 24, // 胶囊高度
    navigateMaxWidth: 0,// 导航宽度
    navigateTitleMaxWidth: 0, // 标题宽度
    navigateContentHeight: 0, // 导航标题区域高度
    navBarSpaceHeight: 0, // 导航整体高度
    menuButtonWidth: 0, // 胶囊区域宽度
  },
  attached: function () {
    this.setData(app.$getCustomNavigationInfo())
  },
  methods: {
    handleClose() {
      this.triggerEvent('close')
    }
  }
})

