<template>
  <div class="charts-box">
    <v-charts
      class="charts"
      :id="echartId"
      :jsonData="chartData"
      ref="lineCharts"
    />
  </div>
</template>

<script>
import VCharts from '@/components/Charts/index.vue'
export default {
  components: {
    VCharts
  },
  props: {
    echartId: {
      type: String,
      default: 'line'
    },
  },
  name: 'lineCharts',
  data () {
    return {
      propsData: null,
      chartData: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        color: [],
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: []
        }],
        yAxis: [{
          type: 'value'
        }],
        series: []
      },
    }
  },

  mounted () { },
  methods: {
    init () {
      let _this = this
      if (!_this.propsData) return false
      _this.chartData.legend.data = _this.propsData.legend
      _this.chartData.color = _this.propsData.color
      _this.chartData.xAxis[0].data = _this.propsData.xAxis
      _this.chartData.series = _this.propsData.series
      _this.$refs.lineCharts.init()
    }
  }
}
</script>
<style lang='scss' scoped>
.charts-box {
  width: 100%;
  height: 100%;
  .charts {
    width: 100%;
    height: 100%;
  }
}
</style>