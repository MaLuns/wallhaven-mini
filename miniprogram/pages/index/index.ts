import favorites from '../../lib/mixins/favorites'
import preview from '../../lib/mixins/preview/index'
const app = getApp();

const search = {
  categories: '111',
  purity: '111',
  ratios: "portrait",
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
  behaviors: [favorites, preview],
  data: {
    loading: true,
    list: [
      {
        title: "热榜",
        type: "hotList"
      },
      {
        title: "月榜",
        type: "topList"
      },
      {
        title: "收藏榜",
        type: "favoritesList"
      },
      {
        title: "随机",
        type: "randomList"
      },
      {
        title: "PC精选",
        type: "pcList"
      }
    ]
  },
  onLoad() {
    app.$apis.test().then(() => {
      this.getData('top', {
        sorting: "toplist",
        topRange: "1M"
      })
      this.getData('pc', {
        sorting: "favorites",
        ratios: "16x9"
      })
      this.getData('random')
      this.getData('favorites')
      this.getData('hot')
      this.getList()
    })
  },
  onReachBottom() {
    if (metaInfo.current_page < metaInfo.last_page) {
      this.getList()
    }
    this.setData({
      loading: metaInfo.current_page < metaInfo.last_page
    })
  },
  // 获取列表
  async getList() {
    let res = await app.$apis.getSearch({
      ...search,
      ratios: "portrait",
      sorting: "views",
      page: metaInfo.current_page + 1
    })

    if (res) {
      let { data = [], meta } = res as ImagesList
      let imageList = this.selectComponent("#image-list")
      imageList.add(data)
      metaInfo = meta
    }
  },
  // 获取绑定数据
  async getData(sorting: string, par = {}) {
    const res = await app.$apis.getSearch({ ...search, sorting, ...par, })
    if (res) {
      let imageList = this.selectComponent(`#${sorting}List`)
      imageList.add(res.data, true)
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