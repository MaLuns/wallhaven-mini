/// <reference path="./types/index.d.ts" />

interface IAppOption {
    globalData: {
        userInfo?: WechatMiniprogram.UserInfo,
    }
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface ImagesList {
    data: Array<ImageItem>,
    meta: Meta
}

interface ImageItem {
    id: string,
    url: string,
    short_url: string,
    views: number
    favorites: number,
    source: string,
    purity: string,
    category: string,
    dimension_x: number,
    dimension_y: number,
    resolution: string,
    ratio: string,
    file_size: number,
    file_type: string,
    created_at: string,
    colors: Array<string>,
    path: string,
    thumbs: {
        large: string,
        original: string,
        small: string
    },
    file_size_str?: string,
    height?: string | number,
    original?: string
}

interface Meta {
    current_page: number,
    last_page: number,
    per_page: number,
    total: number,
    query: null | string,
    seed: null | string
}

interface ImageInfo { }

interface SearchForm {
    q?: string,
    purity?: string,
    categories?: string,
    page?: number,
    ratios?: string,
    sorting?: string,
    order?: string
}

interface NavItem {
    icon?: string,
    pagePath?: string,
    text?: string
}

type CacheDataType = 'favorites' | 'historys'

interface TotalUserData {
    favorites: number,
    historys: number
}

declare enum ScrolStatus {
    invisiable = 0,
    pulling = 1,
    release = 2
}