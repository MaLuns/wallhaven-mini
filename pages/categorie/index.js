const {
  getSearch
} = require('../../lib/api')
const {
  byte
} = require('../../lib/util')

const search = {
  categories: '',
  ratios: "9x16,10x16,9x18,",
}

let metaInfo = {
  current_page: 0
}

Page({
  data: {
    title: '',
    search: {
      categories: [{
        label: '通用',
        checked: true
      }, {
        label: '动漫',
      }, {
        label: '人物',
      }],
      purity: [{
        label: 'SWF',
        checked: true
      }, {
        label: 'Sketchy',
      }],
      order: [{
        label: '降序',
        checked: true,
        value: 'desc'
      }, {
        label: '升序',
        value: 'asc'
      }]
    },
    list_left: [],
    list_right: [],
  },
  onLoad(options) {
    let {
      categories,
      title
    } = options
    this.setData({
      title
    })

    search.categories = categories
    this.getList()
  },
  onPullDownRefresh() {
    metaInfo.current_page = 0
    this.data.list_left = []
    this.data.list_right = []
    this.getList().then(_ => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function () {
    this.getList()
  },
  onPreview(e) {
    const {
      src
    } = e.detail
    wx.previewImage({
      urls: [src],
    })
  },
  close() {
    wx.navigateBack({})
  },
  getList() {
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    return getSearch({
      ...search,
      page: metaInfo.current_page + 1
    }).then(res => {
      let {
        data = [], meta = {}
      } = res.data
      let {
        list_left,
        list_right
      } = this.data
      data.forEach((item, index) => {
        item.file_size_str = byte(item.file_size)
        if (index % 2 == 0) {
          list_left.push(item)
        } else {
          list_right.push(item)
        }
      });

      this.setData({
        list_left,
        list_right
      })
      metaInfo = meta
      wx.hideLoading();
    })
  }
})