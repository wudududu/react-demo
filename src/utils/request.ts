import { getrc } from './rc'

const baseURL = 'http://192.168.1.126:15001/watertrans/cms'

interface Config {
  method: string,
  url: string,
}
interface Post extends Config {
  data: object | {}
}
interface GET extends Config {
  params: object | {}
}

// 请求拦截器
function requestInterceptors<T extends Config> (config: T): T {
  let rc = config.url.includes('?') ? '&rc=' : '?rc='
  config.url += rc + getrc()
  // 在发送请求之前做些什么
  return config
}
// 响应拦截器
function responseInterceptors (response: string) {
  return response
}

// 使用Promise包装
let axios = {
  get: (config: GET) => {
    // 自定义请求
    const xhr = new XMLHttpRequest()
    return new Promise(function (resolve, reject) {
      config.url = baseURL + config.url
      var temp = Object.keys(config.params).reduce((pre, next) => {
        return pre + `${next}=${config.params[next]}&`
      }, '?')
      config.url += temp
      config = requestInterceptors(config)
      xhr.open(config.method, config.url, true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          // 注入响应拦截器
          resolve(responseInterceptors(JSON.parse(xhr.response)))
        }
      }
      xhr.withCredentials = true
      xhr.send()
    })
  },
  post: (config: Post) => {
    // 自定义请求
    const xhr = new XMLHttpRequest()
    return new Promise(function (resolve, reject) {
      config.url = baseURL + config.url
      // 注入请求拦截器
      config = requestInterceptors(config)
      xhr.open(config.method, config.url, true)
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
      xhr.withCredentials = true
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          // 注入响应拦截器
          resolve(responseInterceptors(JSON.parse(xhr.response)))
        }
      }
      xhr.send(JSON.stringify(config.data))
    })
  }
}
export default axios