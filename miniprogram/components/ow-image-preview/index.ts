const toast = require('../ow-toast/toast')

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    list: {
      type: Array,
      value: []
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
    imageLoadError() {
      toast.danger({
        message: '图片加载失败',
        context: this
      })
    },
    close() {
      this.setData({
        show: false
      })
    },
    change(e: { target: { dataset: { index: number } } }) {
      const index = e.target.dataset.index;
      this.setData({
        previewIndex: index,
        previewItem: this.data.list[index]
      })
    },
    changeBigImage(e: { detail: { current: number } }) {
      let current = e.detail.current
      if (current !== this.data.previewIndex) {
        this.setData({
          previewIndex: current,
          previewItem: this.data.list[current]
        })

        this.scrollTo(current)
      }
    },
    scrollTo(index: number) {
      this.createSelectorQuery()
        .select('#scrollview')
        .node()
        .exec((res) => {
          const scrollView = res[0].node;
          scrollView.scrollIntoView(`#image-${index}`);
        })
    },
    preViewImage() {
      wx.previewImage({
        urls: [this.data.previewItem.path],
      })
    },
    checkAuthorize() {
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
    },
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