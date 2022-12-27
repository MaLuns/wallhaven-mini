import toast from '../ow-toast/toast'
const app = getApp()
// swiper 长度
const LEN = 3
const SwiperPlaceholder = { type: "placeholder" }
type State = "Next" | "Last"


Component({
  properties: {
    list: {
      type: Array,
      value: [] as Array<ImageItem>
    },
    index: {
      type: Number,
      value: 0
    },
    type: {
      type: String,
      value: "image"
    }
  },
  data: {
    safeArea: app.globalData.systemInfo.safeArea,
    previewIndex: 0, // 当前元素下标
    previewItem: <ImageItem>{
      path: '',
      thumbs: {
        original: ''
      }
    },
    // swiper 切换
    circular: true,
    duration: 300,
    swiperIndex: 1, // 当前 swiper 下标
    swiperList: <Array<ImageItem>>[],
    previewDateTimeTop: 0,
    // 隐藏其他杂项
    isHide: false,
    // 按钮列表
    btns: [
      {
        icon: "icon-shoucang",
        type: "favorites"
      },
      {
        icon: "icon-xiazai",
        type: "download"
      },
      {
        icon: "icon-fuzhi",
        type: "copy"
      },
      {
        icon: "icon-qiehuan",
        type: "switch"
      }
    ]
  },
  observers: {
    'index,list': function (index, list) {
      if (list.length && list[index]) {
        if (this.data.type === 'image') {
          this._initThumbImage(index, list, () => this._scrollTo(index))
        } else {
          this._initSwiper(index, list)
        }
      }
    },
  },
  lifetimes: {
    attached() {
      const { navBarSpaceHeight } = app.$getCustomNavigationInfo()
      this.setData({
        previewDateTimeTop: navBarSpaceHeight + 40
      })
    },
  },
  methods: {
    // 原图加载失败
    handleImageLoadError() {
      toast.danger({
        message: '壁纸获取失败，可复制链接前往浏览器打开',
        context: this
      })
    },
    // 初始化 略缩图模式
    _initThumbImage(index: number, list: Array<ImageItem>, cb?: Function) {
      this.setData({
        previewIndex: index,
        previewItem: list[index],
        isHide: false
      }, () => {
        if (cb) cb()
      })
    },
    // 略缩图切换
    handleChangeThumbImg(e: WechatMiniprogram.BaseEvent) {
      const index = e.target.dataset.index;
      const item = this.data.list[index]
      this.setData({
        previewIndex: index,
        previewItem: item
      })
      /* console.log(app.$toPx(275)); */
      app.$apis.addHistory(item)
    },
    // 切换 swiper
    handleChangeBigImage(e: WechatMiniprogram.SwiperChange) {
      const { current, source } = e.detail
      if (source !== "touch") return;

      const state = this._getSlideState(current, this.data.swiperIndex)
      const previewIndex = state === "Last" ? this.data.previewIndex - 1 : this.data.previewIndex + 1
      const currentItem = this.data.swiperList[current]

      // 到达了边界时，反弹回去
      if (currentItem.type === "placeholder") {
        this.setData({
          swiperIndex: this.data.swiperIndex
        })
        toast.warning("没有更多了")
        return
      }

      this.setData({
        previewIndex,
        [`swiperList[${this._updateUpdateIndex(current, state)}]`]: this._getUpdateSwiperItem(previewIndex, state),
      })

      //this.data.previewIndex = previewIndex
      this.data.swiperIndex = current

      app.$apis.addHistory(currentItem)
    },
    // 初始化 Swiper 模式
    _initSwiper(index: number, list: Array<ImageItem>, cb?: Function) {
      this.setData({ duration: 0 }, () => {
        let swiperIndex = 1
        let swiperList: Array<ImageItem> = []

        swiperList.push(list[index - 1] || SwiperPlaceholder)
        swiperList.push(list[index] || SwiperPlaceholder)
        swiperList.push(list[index + 1] || SwiperPlaceholder)

        this.setData({
          previewIndex: index,
          swiperIndex,
          swiperList,
          duration: 500,
          isHide: false
        }, () => {
          if (cb) cb()
        })
      })
    },
    // 获取滚动状态
    _getSlideState(current: number, lastCurrent: number): State {
      const state = current - lastCurrent
      return [-1, LEN - 1].includes(state) ? "Last" : "Next"
    },
    // 获取需要更新下标
    _updateUpdateIndex(current: number, type: State) {
      if (type === "Next") {
        return current === (LEN - 1) ? 0 : current + 1
      } else {
        return current === 0 ? (LEN - 1) : current - 1
      }
    },
    // 获取需要更新数据
    _getUpdateSwiperItem(index: number, type: State) {
      const list = this.data.list
      let item
      if (type === "Last") {
        item = list[index - 1]
      } else {
        item = list[index + 1]
      }
      // 到达边界时 返回填充元素
      if (!item) {
        item = SwiperPlaceholder
      }
      return item
    },
    // 滚动到指定略缩图
    _scrollTo(index: number) {
      this.createSelectorQuery()
        .select('#scrollview')
        .node()
        .exec((res) => {
          const scrollView = res[0].node;
          scrollView.scrollIntoView(`#image-${index}`);
        })
    },
    // 切换预览模式
    _changeViewType() {
      let type = this.data.type === 'image' ? 'sw' : 'image'
      this[type === 'sw' ? '_initSwiper' : '_initThumbImage'](this.data.previewIndex, this.data.list, () => {
        this.setData({ type })
      })

      toast.primary("已切换预览模式")
    },
    // 复制
    handleCopyText() {
      let { list, previewIndex } = this.data
      wx.setClipboardData({
        data: list[previewIndex].path,
        success: () => {
          wx.showToast({
            title: '壁纸地址已复制',
            duration: 1000,
          })
        }
      })
    },
    handleChangeIsHide() {
      this.setData({
        isHide: !this.data.isHide
      })
    },
    // 操作按钮
    handleBarBtnClick(e: WechatMiniprogram.CustomEvent) {
      const { type } = e.detail
      switch (type) {
        case 'switch':
          this._changeViewType();
          break;
        case 'favorites':
          wx.vibrateShort({ type: "heavy" })
          let { list, previewIndex } = this.data
          app.$apis.addFavorite(list[previewIndex])
          toast.success("收藏成功！")
          break;
        case 'copy':
          this.handleCopyText()
          break;
        case 'download':
          toast.primary({
            message: '功能开发中，请长按壁纸保存',
            context: this
          })
          break;
      }

    }
  }
})