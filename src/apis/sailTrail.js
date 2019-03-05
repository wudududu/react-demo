import axios from '../utils/axios.js'

// 设定传入的数据对象格式
// interface Data {
//   Id: string
// }
export function getLine(data) {
  return axios({
    method: 'post',
    url: '/getLine',
    data
  })
}