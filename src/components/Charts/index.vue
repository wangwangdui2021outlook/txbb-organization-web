<template >
  <div :class="className" :id="id" :style="eStyle" :jsonData="jsonData"></div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/extension/bmap/bmap')
export default {
  name: 'vCharts',
  props: {
    className: {
      type: String
    },
    id: {
      type: String
    },
    eStyle: {
      type: String
    },
    jsonData: {
      type: Object
    }
  },
  data () {
    return {
      chart: null,
      myChart: null
    }
  },
  mounted () {
    this.init()
    window.addEventListener('resize', () => {
      this.myChart.resize()
    })
  },

  methods: {
    init () {
      // 基于准备好的dom，初始化echarts实例
      const _this = this
      _this.myChart = echarts.init(document.getElementById(_this.id))
      _this.myChart.setOption(_this.jsonData)
    }
  }
}
</script>
<style lang='' scoped>
</style>
