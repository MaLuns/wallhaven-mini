const observe = (obj: Record<string, any>, key: string, watchFun: Function, deep: Boolean, page: WechatMiniprogram.Page.Instance<{}, { watch: any }>) => {
  let oldVal = obj[key]

  if (oldVal !== null && typeof oldVal === 'object' && deep) {
    Object.keys(oldVal).forEach(item => {
      observe(oldVal, item, watchFun, deep, page)
    })
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set(value: any) {
      if (value === oldVal) return
      watchFun.call(page, value, oldVal)
      oldVal = value
    },
    get() {
      return oldVal
    }
  })
}

const watcher = (page: WechatMiniprogram.Page.Instance<{}, { watch: any }>) => {
  if (page.watch) {
    const data = page.data;
    const watch = page.watch
    Object.keys(page.watch).forEach(key => {
      let targetData = data
      const targetKey = key

      const watchFun = watch[key].handler || watch[key]
      const deep = watch[key].deep
      observe(targetData, targetKey, watchFun, deep, page)

    })
  }
}

export default watcher;