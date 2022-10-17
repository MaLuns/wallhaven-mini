import {
  objToUrl
} from "./util"

const baseURL = 'https://wallhaven.cc/api/v1/'
const apikey = ''

export const https = (url, dataType = 'json', method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      dataType,
      method,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

export const getSearch = (pra = {}) => {
  return https(baseURL + 'search?' + objToUrl(pra))
}

export const getInfo = (pra = {}) => {
  return https(baseURL + 'w?' + objToUrl(pra))
}