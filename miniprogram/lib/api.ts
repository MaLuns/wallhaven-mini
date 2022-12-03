import { objToUrl } from "./util"

let catchDataMap = new Map();
let catchMap = new Map();

export const https = async (path: string, method = 'GET', isCatch = true): Promise<ICloud.CallContainerResult | null> => {
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

export const getSearch = (pra = {}): Promise<ICloud.CallContainerResult | null> => https("/search?" + objToUrl(pra))

export const getInfo = (pra = {}): Promise<ICloud.CallContainerResult | null> => https('/w?' + objToUrl(pra))

/**
 * 检查云托管启动
 * @returns 
 */
export const checkContainer = (): Promise<boolean> => {
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