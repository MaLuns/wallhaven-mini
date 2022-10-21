import {
  objToUrl
} from "./util"

let catchDataMap = new Map();
let catchMap = new Map();

export const https = async (path, method = 'GET', isCatch = true) => {
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
  }).catch((e) => null)

  catchMap.delete(path)

  if (res && [200].includes(res.statusCode) && isCatch) {
    catchDataMap.set(path, res)
  }

  return res
}

export const getSearch = (pra = {}) => https("/search?" + objToUrl(pra))

export const getInfo = (pra = {}) => https('/w?' + objToUrl(pra))

export const checkContainer = () => {
  return new Promise((resolve, reject) => {
    let count = 0
    async function test() {
      count++
      const res = await https('/api/wx_openid').catch(e => {
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
            test()
          }, 2000)
        }
      }
    }
    test()
  })

}