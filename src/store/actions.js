import { loginHandler } from '@/api/login'
import { setToken, removeToken, setUserInfo, removeUserInfo } from '@/util/auth'
import GLOBAL from '@/util/common'
/* eslint-disable */

const actions = {
  Login ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginHandler(userInfo).then(res => {
        if (res.code !== GLOBAL.CONFIG.CODE_SUCCESS) return reject(res.msg)
        setToken(res.result.token) // 存入JTWtoken
        setUserInfo(JSON.stringify(res.result))
        commit('SET_USER_TOKEN', res.result.token)
        commit('SET_USER_INFO', res.result)
        resolve(res)
      })
    })
  },
  Logout ({ commit }) {
    removeToken()
    removeUserInfo()
    commit('SET_USER_TOKEN', '')
    commit('SET_USER_INFO', '')
    commit('SET_MENU_LIST', [])
  },
  GetRoutes ({ commit }, router) {
    return new Promise((resolve) => {
      commit('SET_MENU_LIST', router)
      resolve()
    })
  }
}

export default actions
