import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

//平台列表
export function getPlatListHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/getPlatListHandler',
    data: qs.stringify(data)
  })
}
//新增平台
export function createPlatHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/createPlatHandler',
    data: qs.stringify(data)
  })
}
//编辑平台
export function updatePlatHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/updatePlatHandler',
    data: qs.stringify(data)
  })
}
//重置密码
export function resetPasswordHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/resetPasswordHandler',
    data: qs.stringify(data)
  })
}
//平台停用
export function blockPlatHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/blockPlatHandler',
    data: qs.stringify(data)
  })
}
//恢复使用
export function recoverPlatHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/recoverPlatHandler',
    data: qs.stringify(data)
  })
}

//设置异地登录的状态
export function setOtherPlaceHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/setOtherPlaceHandler',
    data: qs.stringify(data)
  })
}

//设置异地登录的状态
export function clearOtherPlaceHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/clearOtherPlaceHandler',
    data: qs.stringify(data)
  })
}