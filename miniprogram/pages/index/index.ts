import { getSearch, checkContainer } from '../../lib/api'

const search = {
  categories: '111',
  purity: '100',
  ratios: "9x16,10x16,9x18,10x18",
  order: 'desc'
}

let metaInfo: Meta = {
  current_page: 0,
  last_page: 1,
  per_page: 0,
  total: 0,
  query: null,
  seed: null
}

Page({
  data: {
    // 预览模式
    previewShow: false,
    previewIndex: 0,
    previewList: [],
    // 导航
    nav: [
      {
        label: '常规',
        value: '100'
      },
      {
        label: '动漫',
        value: '010'
      },
      {
        label: '人物',
        value: '001'
      },
      {
        label: '全部',
        value: '111'
      }
    ]
  },
  onLoad() {
    checkContainer().then(() => {
      this.getData('top', {
        sorting: "toplist",
        topRange: "1w"
      })
      /* this.getData('random') */
      this.getData('favorites')
      this.getData('hot')
      this.getList()
    })
  },
  onReachBottom() {
    if (metaInfo.current_page < metaInfo.last_page) {
      this.getList()
    }
  },
  onPreviewList(e: WechatMiniprogram.CustomEvent) {
    const { index, list } = e.detail;
    this.setData({
      previewShow: true,
      previewIndex: index,
      previewList: list
    })
  },
  async getList() {
    let res = await getSearch({
      ...search,
      ratios: "portrait",
      sorting: "views",
      page: metaInfo.current_page + 1
    })

    if (res) {
      let { data = [], meta } = res.data as List
      let imageList = this.selectComponent("#image-list")
      imageList.add(data)
      metaInfo = meta
    }
  },
  async getData(type: string, par = {}) {
    const res = await getSearch({
      ...search,
      sorting: type,
      ...par,
    })

    if (res) {
      let imageList = this.selectComponent(`#${type}List`)
      imageList.add(res.data.data, true)

    }
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      let src = res.target.dataset.src
      return {
        title: "高清4k壁纸精选",
        path: "/pages/view/index?src=" + src,
        imageUrl: ""
      }
    }
    return {
      title: "高清4k壁纸精选",
      path: "/pages/index/index",
      imageUrl: ""
    }
  }
})