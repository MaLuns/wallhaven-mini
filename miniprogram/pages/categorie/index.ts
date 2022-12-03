import { getSearch } from '../../lib/api'
import { changeTab } from "../../custom-tab-bar/util";
import watcher from '../../lib/watcher'

const defSearch = {
  categories: '111',
  sorting: 'favorites',
  ratios: "portrait",
}

const defMetaInfo = {
  current_page: 0,
  last_page: 1
}

let search: Form = {
  ...defSearch
}

let metaInfo: Meta = {
  per_page: 0,
  total: 0,
  query: null,
  seed: null,
  ...defMetaInfo
}

let imageList: WechatMiniprogram.Component.TrivialInstance;
Page({
  title: '全部',
  data: {
    title: '',
    last_page: 1,
    search: {
      categories: [
        { label: "全部", value: "111", checked: true },
        { label: "通用", value: "100" },
        { label: "动漫", value: "010" },
        { label: "人物", value: "001" },
      ],
      ratios: [
        { label: '全部', value: 'portrait', checked: true },
        { label: '9x16', value: '9x16', },
        { value: '10x16', label: '10x16', },
        { value: '9x18', label: '9x18', }
      ],
      sorting: [
        { label: '收藏', value: 'favorites', checked: true },
        { label: '最新', value: 'date_added' },
        { label: '最热', value: 'hot' },
        { label: '查看', value: 'views' }
      ],
      order: [
        { label: '降序', value: 'desc', checked: true },
        { label: '升序', value: 'asc' }
      ]
    },
    form: {
      q: '',
      page: 1
    } as Form,
    // 预览模式
    previewShow: false,
    previewIndex: 0,
    previewList: [],
  },
  watch: {
    previewShow(val: Boolean) {
      this.getTabBar().setData({
        show: !val
      })
    }
  },
  onShow() {
    changeTab.call(this)
  },
  onLoad() {
    watcher(this)
  },
  onReady() {
    imageList = this.selectComponent("#image-list")
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
  // 打开预览页
  onPreviewList(e: WechatMiniprogram.CustomEvent) {
    const { index, list } = e.detail;
    this.setData({
      previewShow: true,
      previewIndex: index,
      previewList: list
    })
  },
  // 打开查询面板
  openSearch() {
    let search = this.selectComponent(`#search`)
    search.changeSearchPlan()
  },
  // 重置
  reset() {
    metaInfo = {
      ...metaInfo,
      ...defMetaInfo
    }
    this.getList(true).then((_: any) => {
      wx.stopPullDownRefresh()
    })
  },
  // 获取列表
  getList(reset = false) {
    let res = getSearch({
      ...search,
      page: search.page ? search.page : metaInfo.current_page + 1
    }).then((res) => {
      if (res) {
        let { data, meta } = res.data as List

        imageList.add(data, reset)

        this.setData({
          title: this.title + `（${meta.total}）`,
          last_page: meta.last_page
        })
        metaInfo = meta
      }
    })

    delete this.data.form.page
    if (Object.prototype.hasOwnProperty.call(search, "page")) {
      delete search.page
    }

    return res
  },
  // 表单
  onFormChagne(e: WechatMiniprogram.CustomEvent) {
    let type = <string>e.currentTarget.dataset.type;
    let val = e.detail.value
    switch (type) {
      case 'q':
        this.data.form.q = (val as string).replace(/&/g, '').replace(/purity/g, '')
        break;
      case 'ratios':
        this.data.form.ratios = val.length ? (val as Array<any>).join(',') : 'portrait'
        break;
      case 'page':
      case 'sorting':
      case 'categories':
      case 'order':
        (<typeof val>this.data.form[type]) = val
        break;
    }
  },
  // 查询
  onSearch() {
    search = {
      ...search,
      ...this.data.form
    }
    this.reset()
  },
})