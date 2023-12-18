import axios from "axios"

import { ElMessage } from 'element-plus'

// 创建axios 实例
const instance = axios.create({
    baseURL:"http://192.168.191.66:10999/",
    timeout:30000
});
instance.defaults.headers.post = {
    'Content-Type': 'application/x-www-form-urlencoded'
}
// 添加请求拦截器(post只能接受字符串类型数据)
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const errorHandle = (status, other) => {
  switch (status) {
    case 400:
      ElMessage.error('')
      break
    case 401:
      ElMessage.error('')
      break
    case 403:
      ElMessage.error('')
      break
    case 404:
      ElMessage.error('')
      break
    default:
      ElMessage.error(other)
      break
  }
}

// 添加响应拦截器
instance.interceptors.response.use(
  // 响应包含以下信息data,status,statusText,headers,config
  (res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  (err) => {
    ElMessage.error(err)
    const { response } = err
    if (response) {
      errorHandle(response.status, response.data)
      return Promise.reject(response)
    }
    ElMessage.error('请求失败')
    return true
  }
)



export default instance;