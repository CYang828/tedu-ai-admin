import axios from "axios"
import { ElMessage } from "element-plus"

// 创建axios 实例
const instance = axios.create({
    baseURL:"/api",
    timeout:30000
});
// 拦截器
instance.interceptors.request.use(config => {
    /*
    // token 处理
    
    */
   return config;
},error => {
    return Promise.reject(error);
})

instance.interceptors.response.use(res =>{
    return res;
},error => {
    if(error && error.response){


    }
    return Promise.reject(error);
})

export default instance;