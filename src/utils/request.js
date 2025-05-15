import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";

const request = axios.create({
  baseURL: "http://localhost:9090",
  timeout: 30000,// 请求超时时间
});

// 请求拦截器
// 可以在请求发送前对请求做一些处理
request.interceptors.request.use(
    config => {
        config.headers["Content-Type"] = "application/json;charset=utf-8"
        let user= JSON.parse(localStorage.getItem("code_user")||"{}")
        config.headers['token']=user.token
        return config;
    }, error => {
        return Promise.reject(error);
    }
)

// 响应拦截器
// 这里可以跟着做一些响应错误处理
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 兼容服务器返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res;
        }
        if (res.code === '401'){
            ElMessage.error(res.message);
            router.push("/");
        }else{
            return res;
        }
    }, error => {
        if (error.response.status === 404){
            ElMessage.error("请求地址不存在");
        } else if (error.response.status === 500){
            ElMessage.error("服务器异常");
        } else {
            ElMessage.error(error.message);
        }
        return Promise.reject(error);
    }
)

export default request;


