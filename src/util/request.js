/* eslint-disable */
import axios from 'axios'
import { BASE_URL } from './env'
import { Loading, Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, removeToken, removeUserInfo } from '@/util/auth'
/* eslint-disable */
const service = axios.create({
  baseURL: BASE_URL, // 请求根url
  // timeout: 5000 // request timeout
})
const pending = [] // 请求队列
let loading // 定义loading变量
/**
 * 辅助函数,移除已经完成的请求
 */
const removePending = ev => {
  var uid = ev.data
    ? typeof ev.data !== 'string'
      ? JSON.stringify(ev.data)
      : ev.data
    : 'undefined'
  var index = pending.findIndex(row => {
    return ev.url.indexOf(row.url) > -1 && uid === row.uid
  })
  if (index > -1) {
    pending[index].cancel()
    pending.splice(index, 1)
  }
}
function startLoading () { // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading () { // 使用Element loading-close 方法
  loading.close()
}

let needLoadingRequestCount = 0
// 开始加载 ++
export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
// request拦截器
service.interceptors.request.use(config => {
  showFullScreenLoading() //加载loading
  if (store.state.token) {
    config.headers['token'] = getToken()
  }
  removePending(config) // 移除重复的请求
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    removePending(response.config) // 移除重复的请求
    tryHideFullScreenLoading()
    if (!response) return Message({ type: 'error', message: '网路错误，请稍后再试！' })
    if (response.data && response.data.code === 1012 || response.data.code == '1002' || response.data.code == '1014') {
      MessageBox.alert(response.data.msg, '警告', {
        confirmButtonText: '确 定',
        type: 'warning',
        center: true,
        showClose: false,
        callback: action => {
          removeToken()
          removeUserInfo()
          store.commit('SET_USER_TOKEN', '')
          store.commit('SET_USER_INFO', '')
          location.href = `/login?time=${new Date().getTime()}`
          // window.location.reload()
        }
      })
    }
    return response.data
  },
  error => {
    console.log('err' + error)// for debug
    tryHideFullScreenLoading()
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
