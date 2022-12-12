
import toast from '../../components/ow-toast/toast'
const app = getApp()

export default Behavior({
  methods: {
    handleFavorites(e: WechatMiniprogram.CustomEvent) {
      let item = e.detail as ImageItem
      if (app.$apis.hasFavorite(item.id)) {
        toast.warning({
          message: "已收藏！"
        })
      } else {
        wx.vibrateShort({ type: "heavy" })
        app.$apis.addFavorite(item)
        toast.success({
          message: "收藏成功！"
        })
      }
    },
  }
})