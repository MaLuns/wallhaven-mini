/**
 * 存储单位换算
 * @param {*} bytes  
 */
export const byte = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  var k = 1000, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}


/**
 * obj 转 url
 * @param {*} obj 
 */
export const objToUrl = (obj: { [key: string]: any } = {}): string => {
  let str = "";
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += `&${key}=${obj[key]}`;
    }
  }
  return str
}

/**
 * 生成空二维数组
 * @param {*} count 
 * @returns 
 */
export const toTwoDimensionalArray = (count: number, defval: any = undefined): Array<any> => {
  let list: Array<any> = []
  for (let index = 0; index < count; index++) {
    if (defval === undefined) {
      list.push([])
    } else {
      list.push(defval)
    }
  }
  return list;
}