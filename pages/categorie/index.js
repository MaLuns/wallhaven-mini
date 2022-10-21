const { getSearch } = require('../../lib/api')

const defSearch = {
  categories: '',
  sorting: 'favorites',
  ratios: "portrait",
}

const defMetaInfo = {
  current_page: 0,
  last_page: 1
}

let search = {
  ...defSearch
}
let metaInfo = {
  ...defMetaInfo
}

Page({
  data: {
    title: '',
    last_page: 1,
    search: {
      purity: [{
        label: 'SWF',
        checked: true
      }, {
        label: 'Sketchy',
      }],
      ratios: [{
        label: '全部',
        value: 'portrait',
        checked: true
      }, {
        label: '9x16',
        value: '9x16',
      }, {
        value: '10x16',
        label: '10x16',
      }, {
        value: '9x18',
        label: '9x18',
      }],
      sorting: [{
        label: '收藏',
        checked: true,
        value: 'favorites'
      }, {
        label: '最新',
        value: 'date_added'
      }, {
        label: '最热',
        value: 'hot'
      }, {
        label: '查看',
        value: 'views'
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
    form: {
      q: '',
      page: 1
    },
    // 预览模式
    previewShow: false,
    previewIndex: 0,
    previewList: [],
  },
  onLoad(options) {
    let {
      categories,
      title
    } = options

    this.title = title
    this.setData({
      title
    })

    search = {
      ...defSearch,
      categories
    }
    metaInfo = {
      ...defMetaInfo
    }
  },
  onReady() {
    this.imageList = this.selectComponent("#image-list")
    this.reset()
  },
  onPullDownRefresh() {
    this.reset()
  },
  onReachBottom() {
    if (metaInfo.current_page < metaInfo.last_page) {
      this.getList()
    }
  },
  onPreviewList(e) {
    const { index, list } = e.detail;
    this.setData({
      previewShow: true,
      previewIndex: index,
      previewList: list
    })
  },
  onClose() {
    wx.navigateBack({})
  },
  reset() {
    metaInfo = {
      ...defMetaInfo
    }
    this.getList(true).then(_ => {
      wx.stopPullDownRefresh()
    })
  },
  getList(reset = false) {
    let res = getSearch({
      ...search,
      page: search.page ? search.page : metaInfo.current_page + 1
    }).then(res => {
      if (res) {
        let {
          data = [], meta = {}
        } = res.data

        this.imageList.add(data, reset)

        this.setData({
          title: this.title + `（${meta.total}）`,
          last_page: meta.last_page
        })
        metaInfo = meta
      }
    })

    delete this.data.form.page
    delete search.page
    return res
  },
  onFormChagne(e) {
    let {
      type
    } = e.currentTarget.dataset;
    let val = e.detail.value
    switch (type) {
      case 'q':
        this.data.form.q = val.replace(/&/g, '').replace(/purity/g, '')
        break;
      case 'ratios':
        this.data.form.ratios = val.length ? val.join(',') : 'portrait'
        break;
      case 'page':
      case 'sorting':
      case 'order':
        this.data.form[type] = val
        break;
      default:
        break;
    }
  },
  onSearch() {
    search = {
      ...search,
      ...this.data.form
    }
    this.reset()
  }
})