import AbstractApi from "./abstractApi";
import createCacheData, { CacheData } from "../catchData";
import { objToUrl } from "../../util";
import config from "../../config";

let catchDataMap = new Map();
let catchMap = new Map();

const https = async (path: string, isCatch = true): Promise<WechatMiniprogram.RequestSuccessCallbackResult | null> => {
    if (catchMap.has(path)) {
        return null
    } else {
        let data = catchDataMap.get(path)
        if (data) return data;
        catchMap.set(path, true)
    }

    let res: WechatMiniprogram.RequestSuccessCallbackResult = await new Promise((resolve) => {
        wx.request({
            url: config.httpsApiBase + path,
            method: "GET",
            success(res) {
                resolve(res)
            }
        })
    })


    catchMap.delete(path)

    if (res && [200].includes(res.statusCode) && isCatch) {
        catchDataMap.set(path, res)
    }
    return res
}

class HttpApi extends AbstractApi {
    private favorites: CacheData
    private historys: CacheData

    constructor() {
        super()
        this.favorites = createCacheData("favorites")
        this.historys = createCacheData("historys")
    }

    // 查询接口
    getSearch(pra: SearchForm): Promise<ImagesList> | ImagesList {
        return https("/search?" + objToUrl(pra)).then(res => res?.data as ImagesList)
    }

    // 获取图片详情
    getInfo(id: string): Promise<ImageInfo> | ImageInfo {
        return https('/w/' + id).then(res => res?.data)
    }

    // 浏览数和收藏数
    getTotalUserData(): Promise<TotalUserData> | TotalUserData {
        return {
            favorites: createCacheData("favorites").count(),
            historys: createCacheData("historys").count()
        }
    }

    // 获取收藏列表
    getFavorites(): ImageItem[] | Promise<ImageItem[]> {
        return this.favorites.getDataAllSync()
    }

    // 添加收藏
    addFavorite(item: ImageItem): Promise<boolean> | void {
        return this.favorites.setDataSync(item.id, item)
    }

    // 是否收藏
    hasFavorite(id: string): Promise<boolean> | boolean {
        return this.favorites.has(id)
    }

    // 删除收藏
    deleteFavorite(id: string): Promise<boolean> | void {
        return this.favorites.deleteDataSync(id)
    }

    // 删除收藏
    deleteAllFavorite(): Promise<boolean> | void {
        return this.favorites.clearSync()
    }

    // 获取浏览记录列表
    getHistorys(): ImageItem[] | Promise<ImageItem[]> {
        return this.historys.getDataAllSync()
    }

    // 添加浏览记录
    addHistory(item: ImageItem): Promise<boolean> | void {
        return this.historys.setDataSync(item.id, item)
    }

    // 删除收藏
    deleteHistory(id: string): Promise<boolean> | void {
        return this.historys.deleteDataSync(id)
    }

    // 删除收藏
    deleteAllHistory(): Promise<boolean> | void {
        return this.historys.clearSync()
    }

    // 测试链接
    async test(): Promise<boolean> {
        return true
    }
}

export default HttpApi