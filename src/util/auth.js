import GLOBAL from '@/util/common'
/* eslint-disable */

const Token = 'ORGAN_JTW'
const USER_INFO = 'ORGAN_USER_INFO'

export function setToken (token) {
  return GLOBAL.zyLocalStorage.set(Token, token, GLOBAL.TOKEN_TIME)
}

export function getToken () {
  return GLOBAL.zyLocalStorage.get(Token)
}

export function removeToken () {
  localStorage.removeItem(Token)
}

export function setUserInfo (userInfo) {
  return GLOBAL.zyLocalStorage.set(USER_INFO, userInfo, GLOBAL.TOKEN_TIME)
}
export function getUserInfo () {
  return GLOBAL.zyLocalStorage.get(USER_INFO)
}
export function removeUserInfo () {
  return localStorage.removeItem(USER_INFO)
}