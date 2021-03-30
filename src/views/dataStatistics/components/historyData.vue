<template>
  <div>
    <h3>历史数据汇总</h3>
    <div class="table-box">
      <div>
        <p class="data-title">
          数据来源
        </p>
        <el-radio-group v-model="radioSelect" @change="changeChart">
          <el-radio :label="k" v-for="(i, k) in radioType" :key="k">{{
            i
          }}</el-radio>
        </el-radio-group>
      </div>
      <br />
      <div class=" line-chart">
        <line-chart
          ref="lineChart"
          :series="lineData.series"
          :legend="lineData.legend"
          :color="lineData.color"
          :xAxis="lineData.xAxis"
        ></line-chart>
      </div>
    </div>
    <div class="table-box">
      <el-row class="data-do-row">
        <el-col :span="12">
          <el-button round @click="getYesterday">昨日数据</el-button>
        </el-col>
        <el-col :span="12" class="ta-r">
          <el-date-picker
            class="data-ckeck"
            v-model="yesDateTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button class="data-check-btn" @click="_search">
            搜索
          </el-button>
          <export-excel class="export-excel-btn" hickey="exportYesterDay"
            >导出数据</export-excel
          >
        </el-col>
      </el-row>
      <br />
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="plat_name" label="平台名称"></el-table-column>
         <el-table-column prop="task_num" label="投放任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.task_num) + Number(scope.row.cart_task_num) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="take_task_num" label="已接任务数" width="150">
          <template slot-scope="scope">
            {{scope.row.take_task_num) + scope.row.take_task_num) }}
          </template>
        </el-table-column> -->
        <el-table-column prop="cart_wait_commit_task_num" width="150" label="待完成隔日单" v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE"></el-table-column>
        <el-table-column prop="audit_task_num" label="待审核任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.audit_task_num) + Number(scope.row.cart_audit_task_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="finish_task_num" label="已完成任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.finish_task_num) + Number(scope.row.cart_finish_task_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="cancel_task_num" label="失效任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.cancel_task_num) + Number(scope.row.cart_cancel_task_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="fail_num" label="审核失败任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.fail_task_num) + Number(scope.row.cart_fail_task_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="time_out_task_num" label="已超时任务数" width="150">
        </el-table-column>
        <el-table-column prop="reg_num" label="新增用户"></el-table-column>
        <el-table-column prop="active_num" label="月活用户"></el-table-column>
        <el-table-column prop="all_reg_num" label="总用户数"></el-table-column>
        <!-- <el-table-column prop="type" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="getDetails(scope.row)"
            >
              平台详情
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <div class="block">
        <br />
        <el-row>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="sizeBrr"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
          >
          </el-pagination>
        </el-row>
      </div> -->
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import LineChart from "./lineChart";
import { getPlatGraphHandler, getPlatHandler } from "@/api/dataStatistics";
import ExportExcel from "@/components/ExportExcel";
export default {
  components: { LineChart, ExportExcel },
  name: "historyData",
  data () {
    return {
      userInfo: this.$store.state.userInfo? this.$store.state.userInfo : {organ_manager_phone: null},
      industry_status: localStorage.getItem('industry_status'),
      radio: null,
      tableData: [],
      pageSize: this.PAGE_SIZE_TEN,
      currentPage: this.CONFIG.STATUS_TRUE,
      yesDateTime: "", //昨日日期
      totalPage: "",
      lineResult: [],
      radioType: {
        active_num: "月活用户数",
        reg_num: "新增用户数",
        finish_task_num: "完成任务总数",
        task_num: "投放任务数"
      },
      radioSelect: "active_num", // 默认绑定第一个
      lineData: {
        legend: [],
        xAxis: [], // 日期
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
        series: []
      }
    }
  },

  mounted () {
  },
  created () {
    this.getPlatGraph()
    this.getPlatYesterday()
  },
  methods: {
    // 按钮获取昨日数据
    getYesterday () {
      this.yesDateTime = ""
      let localTableData = this.zyLocalStorage.get('tableData' + this.userInfo.organ_manager_phone + this.industry_status)
      if (localTableData && this.yesDateTim == '' && this.currentPage == 1 && this.pageSize == 10) {
        this.tableData = localTableData
        return
      }
      this.getPlatYesterday()
    },
    //历史数据图形
    async getPlatGraph () {
      let _this = this;
      let localLineResult = await _this.zyLocalStorage.get('lineResult' + this.userInfo.organ_manager_phone + this.industry_status)
      if (localLineResult) {
        _this.lineResult = localLineResult
        _this.changeChart()
        return false
      }
      let data = await getPlatGraphHandler({industry_status: this.industry_status});
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return false
      if (data.result && data.result.length > 0) {
        _this.lineResult = data.result
        _this.zyLocalStorage.set('lineResult' + this.userInfo.organ_manager_phone + this.industry_status, _this.lineResult, _this.getOnedaySeconds())
        _this.changeChart()
      }
    },
    //获取一天的时间，最少为6小时
    getOnedaySeconds () {
      let now = new Date()
      let tommorow = new Date();
      let sixHours = 6 * 60 * 60 * 1000
      tommorow.setTime(tommorow.getTime() + 24 * 60 * 60 * 1000);
      var tommorowDay = new Date(tommorow.getFullYear() + "-" + (tommorow.getMonth() + 1) + "-" + tommorow.getDate())
      let timeDifference = tommorowDay.getTime() - now.getTime()
      timeDifference = timeDifference > sixHours ? timeDifference : sixHours
      return Math.ceil(timeDifference / 1000)
    },
    // 搜索
    _search () {
      this.getPlatYesterday()
    },
    // 修改数据来源
    changeChart () {
      let _this = this
      let xAxis = []
      let legend = [] //name
      if (!_this.lineResult.length) return false
      let series = _this.lineResult.map((item) => {
        legend.push(`${item.plat_name}(${_this.radioType[_this.radioSelect]})`)
        let obj = {
          name: `${item.plat_name}(${_this.radioType[_this.radioSelect]})`,
          type: "line",
          // areaStyle: {
          //   color: _this.lineData.color[index]
          // },
          data: []
        };
        item.result.map(i => {
          if (xAxis.indexOf(i.date) == -1) {
            xAxis.unshift(i.date)
          }
          obj.data.unshift(i[_this.radioSelect])
        })
        return obj
      })
      _this.lineData.legend = legend
      _this.lineData.xAxis = xAxis
      _this.lineData.series = series
      _this.$refs.lineChart.propsData = _this.lineData
      _this.$refs.lineChart.init()
    },
    // 昨日数据
    async getPlatYesterday () {
      let _this = this
      let nowData = _this.zyLocalStorage.get('yesterTableData' + this.userInfo.organ_manager_phone + this.industry_status)
     if (nowData && !_this.yesDateTime && _this.currentPage == 1 && _this.pageSize == 10) {
        _this.tableData = nowData
        return
      }
      _this.tableData = []
      let postData = {
        date: this.yesDateTime,
        page: this.currentPage,
        page_size: this.pageSize,
        industry_status: this.industry_status
      }
      let data = await getPlatHandler({ ...postData })
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return false
      _this.tableData = data.result.result
      if (!_this.yesDateTim && _this.currentPage == 1 && _this.pageSize == 10) {
        _this.zyLocalStorage.set('yesterTableData' + this.userInfo.organ_manager_phone + this.industry_status, _this.tableData, _this.getOnedaySeconds())
      }
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getPlatYesterday()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getPlatYesterday()
    }
  }
};
</script>
<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 400px;
}
.font-box {
  text-align: center;
  background: #fff;
  margin-top: 30px;
  padding: 38px 0;
  border-radius: 6px;
}
.today-num {
  font-size: 34px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 40px;
}
.today-text {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  line-height: 20px;
  margin-top: 10px;
}
.data-title {
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(102, 102, 102, 1);
  line-height: 22px;
  margin-bottom: 30px;
}

.export-excel-btn {
  margin-left: 10px;
}
</style>
