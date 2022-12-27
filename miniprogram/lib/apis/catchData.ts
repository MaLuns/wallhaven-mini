const _data: Record<string, CacheData> = {}

/**
 * 本地数据缓存操作类
 */
export class CacheData {
  key = ''

  _keys: Array<string> = []

  constructor(type: string) {
    this.key = type
  }

  /**
   * 获取所有 ID
   */
  get keys() {
    if (this._keys.length) {
      return this._keys
    } else {
      const data = wx.getStorageSync(this.key)
      if (data) {
        this._keys = Object.keys(data)
      }
      return this._keys
    }
  }

  /**
   * 检查 ID 是否存在
   * @param id 数据 ID
   */
  has(id: string) {
    return this.keys.findIndex(item => item === id) > -1
  }

  /**
   * 设置数据
   * @param id 数据 ID
   * @param data 
   */
  setDataSync(id: string, data: ImageItem) {
    if (!this.has(id)) {
      const list = wx.getStorageSync(this.key) || {}
      this._keys.push(id)
      wx.setStorageSync(this.key, {
        ...list,
        [id]: data
      })
    }
  }

  /**
   * 根据 ID 获取数据
   * @param id 数据 ID
   */
  getDataSync(id: string): ImageItem {
    const list = wx.getStorageSync(this.key) || {}
    return list[id]
  }

  /**
   * 获取所有数据
   */
  getDataAllSync(): Array<ImageItem> {
    const list = wx.getStorageSync(this.key) || {}
    return Object.values(list)
  }

  /**
   * 根据 ID 删除数据
   * @param id 数据 ID
   */
  deleteDataSync(id: string) {
    const list = wx.getStorageSync(this.key) || {}
    delete list[id]
    this._keys = this._keys.filter(item => item !== id)
    wx.setStorageSync(this.key, list)
  }

  /**
   * 清楚所有数据
   */
  clearSync() {
    this._keys = []
    wx.removeStorageSync(this.key)
  }

  /**
   * 获取数量
   */
  count(): number {
    return this.keys.length
  }
}

/**
 * 获取 CacheData
 * @param key 
 */
const createCacheData = (key: CacheDataType): CacheData => {
  if (_data[key]) {
    return _data[key]
  } else {
    let data = new CacheData(key)
    _data[key] = data
    return data
  }
}

export default createCacheData