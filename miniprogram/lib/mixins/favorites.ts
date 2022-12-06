import createCacheData from '../catchData'
import toast from '../../components/ow-toast/toast'

export default Behavior({
  methods: {
    handleFavorites(e: WechatMiniprogram.CustomEvent) {
      let item = e.detail as ImageItem
      let cacheData = createCacheData('favorites')
      if (cacheData.has(item.id)) {
        /* cacheData.deleteDataSync(item.id) */
        toast.warning({
          message: "已收藏！"
        })
      } else {
        wx.vibrateShort({ type: "heavy" })
        cacheData.setDataSync(item.id, item)
        toast.success({
          message: "收藏成功！"
        })
      }
    },
  }
})