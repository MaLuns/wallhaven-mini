import toast from '../ow-toast/toast'
const app = getApp()

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
    previewIndex: 0,
    previewItem: {
      path: '',
      thumbs: {
        original: ''
      }
    },
  },
  observers: {
    'index,list': function (index, list) {
      if (list.length && list[index]) {
        this.setData({
          previewIndex: index,
          previewItem: list[index]
        }, () => {
          this.scrollTo(index)
        })
      }
    },
  },
  methods: {
    handleImageLoadError() {
      toast.danger({
        message: '图片加载失败',
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
    handleChangeBigImage(e: WechatMiniprogram.CustomEvent) {
      let current = e.detail.current
      if (current !== this.data.previewIndex) {
        this.setData({
          previewIndex: current,
          previewItem: this.data.list[current]
        })

        this.scrollTo(current)
      }
    },
    // 滚动到指定下标
    scrollTo(index: number) {
      this.createSelectorQuery()
        .select('#scrollview')
        .node()
        .exec((res) => {
          const scrollView = res[0].node;
          scrollView.scrollIntoView(`#image-${index}`);
        })
    },
    // 调用原生预览
    preViewImage() {
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
    saveImage() {
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
    }
  }
})