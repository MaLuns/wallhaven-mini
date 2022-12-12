import watcher from './watcher'

function onLoadProxy(onLoad?: WechatMiniprogram.Page.ILifetime['onLoad']): WechatMiniprogram.Page.ILifetime['onLoad'] {
  return function newOnLoad(this: WechatMiniprogram.Page.Instance<{}, { watch: any }>, query) {
    watcher(this)
    if (onLoad) {
      return onLoad.call(this, query);
    }
  };
}

export const PageProxy = (Page: WechatMiniprogram.Page.Constructor): WechatMiniprogram.Page.Constructor => {
  return function newPage(options) {
    const newOptions = { ...options };
    newOptions.onLoad = onLoadProxy(options.onLoad);
    return Page(newOptions);
  };
}
