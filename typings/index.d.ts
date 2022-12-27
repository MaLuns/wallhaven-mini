/// <reference path="./types/index.d.ts" />

interface IAppOption {
    globalData: {
        userInfo?: WechatMiniprogram.UserInfo,
    }
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

// 壁纸列表
interface ImagesList {
    data: Array<ImageItem>,
    meta: Meta
}

// 壁纸信息
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
    original?: string,
    type?: string
}

// 分页信息
interface Meta {
    current_page: number,
    last_page: number,
    per_page: number,
    total: number,
    query: null | string,
    seed: null | string
}

interface ImageInfo { }

// 查询表单
interface SearchForm {
    q?: string,
    purity?: string,
    categories?: string,
    page?: number,
    ratios?: string,
    sorting?: string,
    order?: string,
    apikey?: string
}

// 自定义 Tab
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

/**
 * 自定义导航信息
 */
interface CustomNavigationInfo {
    /**
     * 胶囊高度
     */
    statusBarHeight: number,
    /**
     * 胶囊区域宽度
     */
    menuButtonWidth: number,
    /**
     * 导航宽度 = 宽度 - 胶囊宽度
     */
    navigateMaxWidth: number,
    /**
     * 标题宽度 = 宽度 - 胶囊宽度*2
     */
    navigateTitleMaxWidth: number,
    /**
     * 导航标题区域高度
     */
    navigateContentHeight: number,
    /**
     * 导航整体高度
     */
    navBarSpaceHeight: number,
}