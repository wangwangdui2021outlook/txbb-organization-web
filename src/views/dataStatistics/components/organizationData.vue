<template>
  <div>
    <h3>机构数据汇总</h3>
    <el-row :gutter="20">
      <el-col :span="24 / boxData.length" v-for="(item, index) in boxData" :key="index">
        <div class="font-box">
          <p class="today-num">
            {{ item.number }}
          </p>
          <p class="today-text">
            {{ item.title }}
          </p>
        </div>
      </el-col>
    </el-row>
    <div class="table-box line-chart">
      <line-chart
        ref="lineChart"
        :series="lineData.series"
        :legend="lineData.legend"
        :color="lineData.color"
        :xAxis="lineData.xAxis"
        :echartId="'line1'"
      ></line-chart>
    </div>
    <div class="table-box">
      <el-row class="ta-r data-do-row">
        <el-date-picker
          class="data-ckeck"
          v-model="dataTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-button class="data-check-btn" @click="_search">
          搜索
        </el-button>
        <export-excel class="export-excel-btn" hickey="exportDataHandler"
          >导出数据</export-excel
        >
      </el-row>
      <br />
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="150"></el-table-column>
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
        <el-table-column prop="reg_num" label="新增用户" width="150"></el-table-column>
        <el-table-column prop="active_num" label="月活用户" width="150"></el-table-column>
        <el-table-column prop="all_reg_num" label="总用户数" width="150"></el-table-column>
        
      </el-table>
      <div class="block">
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
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import LineChart from './lineChart'
import { getOrganHandler, getOrganGraphHandler } from '@/api/dataStatistics'
import ExportExcel from '@/components/ExportExcel'
export default {
  components: { LineChart, ExportExcel },
  name: 'organizationData',
  data () {
    return {
      userInfo: this.$store.state.userInfo? this.$store.state.userInfo : {organ_manager_phone: null},
      industry_status: localStorage.getItem('industry_status'),
      tableData: [],
      dataTime: '',
      currentPage: this.CONFIG.STATUS_TRUE,
      pageSize: this.PAGE_SIZE_TEN,
      totalPage: '',
      boxData: [],
      boxDataOld: [
        {
          title: '总用户数',
          number: 0,
          type: 'all_reg_num'
        },
        {
          title: '累计投放任务数',
          number: 0,
          type: 'all_task_num'
        },
        {
          title: '累计完成任务数',
          number: 0,
          type: 'all_finish_num'
        }
      ],
      boxDataNew: [
        {
          title: '总用户数',
          number: 0,
          type: 'all_reg_num'
        },
        {
          title: '累计投放普通任务数',
          number: 0,
          type: 'all_task_num'
        },
        {
          title: '累计投放隔日任务数',
          number: 0,
          type: 'cart_all_task_num'
        },
        {
          title: '累计完成任务数',
          number: 0,
          type: 'all_finish_num'
        }
      ],
      lineData: {},
      lineDataOld: {
        legend: ['月活用户数', '投放任务数', '完成任务数'],
        color: ['#E3012C', '#0097FF', '#FFA900'],
        xAxis: [],
        series: [
          {
            name: '月活用户数',
            type: 'line',
            // areaStyle: {
            //   color: '#FFEAEE'
            // },
            data: [],
            num_type: 'active_num'
          },
          {
            name: '投放任务数',
            type: 'line',
            // areaStyle: {
            //   color: '#E0F2FF'
            // },
            data: [],
            num_type: 'task_num'
          },
          {
            name: '完成任务数',
            type: 'line',
            // areaStyle: {
            //   color: '#FFF5E1'
            // },
            data: [],
            num_type: 'finish_task_num'
          }
        ]
      },
      lineDataNew: {
        legend: ['月活用户数', '投放普通任务数', '投放隔日任务数', '完成任务数'],
        color: ['#E3012C', '#0097FF', '#FFA900','#2CB82E'],
        xAxis: [],
        series: [
          {
            name: '月活用户数',
            type: 'line',
            // areaStyle: {
            //   color: '#FFEAEE'
            // },
            data: [],
            num_type: 'active_num'
          },
          {
            name: '投放普通任务数',
            type: 'line',
            // areaStyle: {
            //   color: '#E0F2FF'
            // },
            data: [],
            num_type: 'task_num'
          },
           {
            name: '投放隔日任务数',
            type: 'line',
            // areaStyle: {
            //   color: '#E0F2FF'
            // },
            data: [],
            num_type: 'cart_task_num'
          },
          {
            name: '完成任务数',
            type: 'line',
            // areaStyle: {
            //   color: '#FFF5E1'
            // },
            data: [],
            num_type: 'finish_task_num'
          }
        ]
      }
    }
  },

  mounted () { },
  created () {
    let boxData = this.boxDataOld
    let lineData = this.lineDataOld
    if(this.industry_status != this.CONFIG.INDUSTRY_STATUS_CLOSE){
      boxData = this.boxDataNew
      lineData = this.lineDataNew
    }
    this.boxData = boxData
    this.lineData = lineData
    this.getOrgan()
    this.getOrganGraph()
  },
  methods: {
    // 搜索
    _search () {
      this.getOrgan()
    },
    //获取机构数据汇总表格
    async getOrgan () {
      let _this = this
      let localTotalPage = _this.zyLocalStorage.get('totalPage' + this.userInfo.organ_manager_phone + this.industry_status)
      let localTableData = _this.zyLocalStorage.get('tableData' + this.userInfo.organ_manager_phone + this.industry_status)
      if (localTotalPage && localTableData && !_this.dataTime && _this.currentPage == 1 && _this.pageSize == 10) {
        _this.tableData = localTableData
        _this.totalPage = localTotalPage
        return false
      }
      _this.tableData = []
      _this.totalPage = 10
      let postData = {
        date: _this.dataTime,
        page: _this.currentPage,
        page_size: _this.pageSize,
        industry_status: this.industry_status
      }
      let data = await getOrganHandler({ ...postData })
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return false
      _this.totalPage = data.result.count_all
      _this.tableData = data.result.result
      if (!_this.dataTime && _this.currentPage == 1 && _this.pageSize == 10) {
        let onedaySecond = _this.getOnedaySeconds()
        _this.zyLocalStorage.set('totalPage' + this.userInfo.organ_manager_phone + this.industry_status, _this.totalPage, onedaySecond)
        _this.zyLocalStorage.set('tableData' + this.userInfo.organ_manager_phone + this.industry_status, _this.tableData, onedaySecond)
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
    //机构数据汇总图形
    async getOrganGraph () {
      let _this = this
      // async 函数里面执行的代码必须包含await，不然执行顺序，不会按照正常的js执行顺序
      let localLineData = await _this.zyLocalStorage.get('lineData' + this.userInfo.organ_manager_phone + this.industry_status)
      let localBoxData = await _this.zyLocalStorage.get('boxData' + this.userInfo.organ_manager_phone + this.industry_status)
      if (localLineData && localBoxData) {
        _this.lineData = localLineData
        _this.boxData = localBoxData
        _this.$refs.lineChart.propsData = _this.lineData
        _this.$refs.lineChart.init()
        return
      }
      let data = await getOrganGraphHandler({industry_status: this.industry_status})
      if (data.result.result && data.result.result.length > 0) {
        _this.boxData.map(item => {
          item.number = data.result.result[0][item.type]
        })
        data.result.result.map((item) => {
          _this.lineData.xAxis.unshift(item.date)
          _this.lineData.series.map(i => {
            i.data.unshift(item[i.num_type])
          })
        })
        let onedaySecond = _this.getOnedaySeconds()
        _this.zyLocalStorage.set('boxData' + this.userInfo.organ_manager_phone + this.industry_status, _this.boxData, onedaySecond)
        _this.zyLocalStorage.set('lineData' + this.userInfo.organ_manager_phone + this.industry_status, _this.lineData, onedaySecond)
        _this.$refs.lineChart.propsData = _this.lineData
        _this.$refs.lineChart.init()
      }
    },
    // 分页每页显示多少条
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getOrgan()
    },
    // 下一页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getOrgan()
    }
  }
}
</script>
<style lang='scss' scoped>
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
  p { 
    margin:0;
    padding:0;
  }
}
.font-box{
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
}
.export-excel-btn {
  margin-left: 10px;
}
</style>