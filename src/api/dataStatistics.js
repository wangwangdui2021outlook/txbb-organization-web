import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

//获取机构下的平台数据汇总
export function getTodayHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getTodayHandler',
    data: qs.stringify(data)
  })
}
//机构数据汇总
export function getOrganHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getOrganHandler',
    data: qs.stringify(data)
  })
}
//机构数据汇总图形
export function getOrganGraphHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getOrganGraphHandler',
    data: qs.stringify(data)
  })
}
// 导出机构数据汇总
export function getOrganExportHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getOrganExportHandler',
    data: qs.stringify(data)
  })
}
// 历史数据图形
export function getPlatGraphHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getPlatGraphHandler',
    data: qs.stringify(data)
  })
}
//历史数据
export function getPlatHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getPlatHandler',
    data: qs.stringify(data)
  })
}
///导出历史数据
export function getPlatExportHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Statistics/getPlatExportHandler',
    data: qs.stringify(data)
  })
}