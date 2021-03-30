// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './permission' // permission

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon/iconfont/iconfont.css'
import '@/assets/theme/index.css'

import 'normalize.css'
import * as filters from './filters'
import VueClipboard from 'vue-clipboard2'
import Config from './util/common'
import upload from './components/Upload/index.js'

Vue.use(ElementUI)
Vue.use(VueClipboard)
Object.keys(Config).forEach(key => {
  Vue.prototype[key] = Config[key]
})
Vue.config.productionTip = false
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.use(upload)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

