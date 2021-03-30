import router from './router'
import store from './store'
import {
  getToken,
  removeToken,
  removeUserInfo
} from '@/util/auth'
import globalDefine from '@/util/common'
/* eslint-disable */
const whiteList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  // 每次加载路由判断是否已经获取用户信息 若未获取用户信息则跳转到登录
  if (getToken()) {
    if (to.path === '/login') {
      removeToken()
      removeUserInfo()
      store.commit('SET_USER_TOKEN', '')
      store.commit('SET_USER_INFO', '')
      next()
    } else {
      // 切换主题
      if(localStorage.getItem('industry_status') != globalDefine.CONFIG.INDUSTRY_STATUS_CLOSE){
        window.document.documentElement.setAttribute('data-theme', 'nav2')
      }else{
        window.document.documentElement.setAttribute('data-theme', 'nav1')
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})