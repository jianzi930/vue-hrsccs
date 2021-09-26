import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 3600

// 创建axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})

// 请求拦截器
service.interceptors.request.use(async config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在，判断是否失效
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      await store.dispatch('user/logout') // 登出操作
      router.push('/login') // 跳转到登录页
      return Message.error('登录超时，重新登陆')
    }
    // 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 如果success位 true 请求成功，返回数据，业务进入then
  if (success) {
    return data
  } else {
    // 如果success位 false 请求失败，返回错误对象，使得业务进入catch
    return Promise.reject(new Error(message))
  }
}, error => {
  // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
    return Message.error('登录超时，重新登陆')
  }
  return Promise.reject(error)
})

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
