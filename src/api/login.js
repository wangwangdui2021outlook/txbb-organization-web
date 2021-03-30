import request from '@/util/request'
import qs from 'qs'
import globalDefine from '@/util/common'

//分销商登录
export function loginHandler (data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/Login/loginHandler',
    data: qs.stringify(data)
  })
}

//  修改自己的密码
export function changePasswordHandler(data) {
  return request({
    method: 'post',
    url: globalDefine.api + '/PlatManager/changePasswordHandler',
    data: qs.stringify(data)
  })
}
