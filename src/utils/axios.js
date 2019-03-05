import axios from 'axios'
import { getrc } from './rc'

// 配置全局axios
axios.defaults.baseURL = 'http://192.168.1.126:15001/watertrans/cms' // 记得替换地址
axios.defaults.withCredentials = true // 设置Cookie
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.timeout = 5000

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let rc = config.url.includes('?') ? '&rc=' : '?rc='
  config.url += rc + getrc()
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.status === 200) {
    return response
  }
}, function (error) {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    window.location.href = '/#/login'
    Message.warning('会话过期，请重新登录')
  }
  return Promise.reject(error)
})

export default axios