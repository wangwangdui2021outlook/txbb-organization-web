<template>
  <div class="charts-box">
    <v-charts
      class="charts"
      :id="echartId"
      :jsonData="chartData"
      ref="pieCharts"
    />
  </div>
</template>

<script>
import VCharts from "@/components/Charts/index.vue";
export default {
  props: {
    echartId: String
  },
  components: {
    VCharts
  },
  name: "pieChart",
  data () {
    return {
      propsData: null,
      chartData: {
        title: [
          {
            text: "",
            textStyle: {
              fontSize: 12,
              color: "#666666"
            },

            textAlign: "center",
            x: "48%",
            y: "48%"
          }
        ],
        color: [
          "#B620E0",
          "#1B00F9",
          "#DA0000",
          "#FF6966",
          "#FF631E",
          "#28B72A",
          "#29B7A3",
          "#00C1EE",
          "#199DFE",
          "#E200C4",
          "#2A58AD",
          "#F12198"
        ],
        tooltip: {
          trigger: "item",
          formatter: function (parms) {
            var str =
              parms.marker +
              "" +
              parms.data.name +
              "</br>" +
              "数量：" +
              parms.data.value +
              "</br>" +
              "占比：" +
              parms.percent +
              "%";
            return str;
          }
        },
        series: [
          {
            name: "",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["40%", "50%"],
            clockwise: false, //饼图的扇区是否是顺时针排布
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: []
          }
        ]
      }
    };
  },

  mounted () { },

  methods: {
    init () {
      let _this = this
      if (!_this.propsData) return false
      _this.chartData.title[0].text = _this.propsData.title
      _this.chartData.series[0].data = _this.propsData.pieData
      _this.$refs.pieCharts.init()
    }
  }
};
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