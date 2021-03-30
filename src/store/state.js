import { getToken, getUserInfo } from '@/util/auth'

const state = {
  token: getToken(),
  userInfo: getUserInfo() ? JSON.parse(getUserInfo()) : {},
  asyncMenuList: []
}

export default state
