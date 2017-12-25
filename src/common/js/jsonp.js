import originJSONP from 'jsonp'


/**
 * 封装jsonp请求，promise化
 * 
 * @export
 * @param {any} url 请求地址
 * @param {any} data 
 * @param {any} opts 
 */
export default function jsonp(url, data, opt) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, opt, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}


function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substr(1) : ''
}
