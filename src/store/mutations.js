/* eslint-disable */

const mutations = {
  SET_USER_TOKEN: (state, data) => {
    state.token = data
  },
  SET_USER_INFO: (state, data) => {
    state.userInfo = data
  },
  SET_MENU_LIST: (state, data) => {
    state.asyncMenuList = data
  }
}

export default mutations
