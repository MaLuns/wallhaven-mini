const {
  getSearch
} = require('../../lib/api')
const {
  byte
} = require('../../lib/util')

const search = {
  categories: '111',
  purity: '100',
  ratios: "9x16,10x16,9x18,",
  order: 'desc'
}

let metaInfo = {
  current_page: 0
}


Page({
  data: {
    // 随机
    randomList: [],
    // 最近跟新
    list_left: [],
    list_right: [],
    // 预览模式
    previewShow: false,
    previewIndex: 0,
    previewList: [],
    // 导航
    nav: [{
      label: '常规',
      value: '100'
    }, {
      label: '动漫',
      value: '010'
    }, {
      label: '人物',
      value: '001'
    }, {
      label: '全部',
      value: '111'
    }]
  },
  onLoad() {
    this.randomData()
    this.getList()
  },
  onPullDownRefresh() {
    this.randomData().then(_ => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
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
  onPreviewList(e) {
    const {
      idx
    } = e.detail;
    this.setData({
      previewShow: true,
      previewIndex: idx,
      previewList: this.data.randomList
    })
  },
  getList() {
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    getSearch({
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
        list_right,
      })

      metaInfo = meta
      wx.hideLoading();
    })
  },
  randomData() {
    return getSearch({
      ...search,
      sorting: "random",
    }).then(res => {
      this.setData({
        randomList: res.data.data
      })
    })
  }
})