import AbstractApi from "./abstractApi";
import createCacheData, { CacheData } from "../catchData";
import { objToUrl } from "../../util";
import config from "../../config";

let catchDataMap = new Map();
let catchMap = new Map();

const https = async (path: string, method = 'GET', isCatch = true): Promise<ICloud.CallContainerResult | null> => {
    if (catchMap.has(path)) {
        return null
    } else {
        let data = catchDataMap.get(path)
        if (data) return data;
        catchMap.set(path, true)
    }

    let res = await wx.cloud.callContainer({
        path,
        method,
        header: {
            "X-WX-SERVICE": "express-lm6t"
        }
    }).catch(() => null)

    catchMap.delete(path)

    if (res && [200].includes(res.statusCode) && isCatch) {
        catchDataMap.set(path, res)
    }

    return res
}

class CloudApi extends AbstractApi {
    private favorites: CacheData
    private historys: CacheData

    constructor() {
        super()
        wx.cloud.init({
            env: config.cloudEnv
        })
        this.favorites = createCacheData("favorites")
        this.historys = createCacheData("historys")
    }

    // 查询接口
    getSearch(pra: SearchForm): ImagesList | Promise<ImagesList> {
        return https("/search?" + objToUrl(pra)).then(res => res?.data)
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
    test(): Promise<boolean> {
        return new Promise((resolve) => {
            let count = 0
            const container = async () => {
                count++
                const res = await https('/test', 'GET', false).catch(e => {
                    console.log(e);
                })

                if (res && res.statusCode < 400) {
                    resolve(true)
                } else {
                    if (count > 20) {
                        resolve(false)
                    } else {
                        console.log(`第${count}次连接`, res)
                        setTimeout(() => {
                            container()
                        }, 2000)
                    }
                }
            }

            container()
        })
    }
}

export default CloudApi