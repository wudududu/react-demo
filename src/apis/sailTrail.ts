import axios from '../utils/request'

// 设定传入的数据对象格式
interface Data {
  Id: string
}
export function getLine(data: Data) {
  return axios.post({
    method: 'POST',
    url: '/getLine',
    data
  })
}