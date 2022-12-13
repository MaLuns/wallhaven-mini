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
    circular: true,
    duration: 300,
    swiperIndex: 1, // 当前 swiper 下标
    swiperList: <Array<ImageItem>>[]
  },
  observers: {
    'index,list': function (index, list) {
      if (list.length && list[index]) {
        if (this.data.type === 'image') {
          this.setData({ previewIndex: index, previewItem: list[index] }, () => this._scrollTo(index))
        } else {
          this._initSwiper(index, list)
        }
      }
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
        return
      }

      this.setData({
        [`swiperList[${this._updateUpdateIndex(current, state)}]`]: this._getUpdateSwiperItem(previewIndex, state),
      })

      this.data.previewIndex = previewIndex
      this.data.swiperIndex = current
    },
    // 初始化 Swiper
    _initSwiper(index: number, list: Array<ImageItem>) {
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
          duration: 500
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
    // 调用原生预览
    handlePreViewImage() {
      wx.previewImage({
        urls: [this.data.previewItem.path],
      })
    },
    /* checkAuthorize() {
      return new Promise<void>((resolve) => {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  resolve()
                },
                fail: () => {
                  wx.showModal({
                    title: '提示',
                    content: '您拒绝了相册权限，将无法使用下载功能',
                    success: res => {
                      if (res.confirm) {
                        // 跳转设置页面
                        wx.openSetting({
                          success: res => {
                            if (res.authSetting['scope.writePhotosAlbum']) {
                              resolve()
                            }
                          }
                        });
                      }
                    }
                  });
                }
              })
            } else {
              resolve()
            }
          }
        })
      })
    }, */
    handleSaveImage() {
      toast.primary({
        message: '功能开发中，请点击预览长按保存',
        context: this
      })
      /* return;
      this.checkAuthorize().then(() => {
        wx.getImageInfo({
          src: this.data.previewUrl,
          success: (res) => {
            let path = res.path;
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success: (res) => {
                console.log(res);
              },
              fail: (res) => {
                console.log(res);
              }
            })
          },
          fail: (res) => {
            console.log(res);
          }
        })

      }) */
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
    }
  }
})