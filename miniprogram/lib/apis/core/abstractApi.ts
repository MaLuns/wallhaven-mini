abstract class AbstractApi {
    // 查询接口
    abstract getSearch(pra: SearchForm): ImagesList | Promise<ImagesList>

    // 获取图片详情
    abstract getInfo(id: string): ImageInfo | Promise<ImagesList>

    // 浏览数和收藏数
    abstract getTotalUserData(): Promise<TotalUserData> | TotalUserData

    // 获取收藏列表
    abstract getFavorites(): Array<ImageItem> | Promise<Array<ImageItem>>

    // 是否已收藏
    abstract hasFavorite(id: string): Promise<boolean> | boolean

    // 添加收藏
    abstract addFavorite(item: ImageItem): Promise<boolean> | void

    // 删除收藏
    abstract deleteFavorite(id: string): Promise<boolean> | void

    // 删除收藏
    abstract deleteAllFavorite(): Promise<boolean> | void

    // 获取浏览记录列表
    abstract getHistorys(): Array<ImageItem> | Promise<Array<ImageItem>>

    // 添加浏览记录
    abstract addHistory(item: ImageItem): Promise<boolean> | void

    // 删除收藏
    abstract deleteHistory(id: string): Promise<boolean> | void

    // 删除收藏
    abstract deleteAllHistory(): Promise<boolean> | void

    // 测试链接
    abstract test(): Promise<boolean>
}

export default AbstractApi