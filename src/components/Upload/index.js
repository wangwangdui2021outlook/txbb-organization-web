import Upload from './index.vue'
// 这里是重点
const upload = {
  install: function (Vue) {
    Vue.component('upload', Upload)
  }
}

// 导出组件
export default upload
