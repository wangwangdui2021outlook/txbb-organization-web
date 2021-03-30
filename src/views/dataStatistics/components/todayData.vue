<template>
  <div>
    <h3>今日实时数据-汇总</h3>
    <el-row class="table-box">
      <el-col :span="24 / boxData.length" v-for="(item, index) in boxData" :key="index">
        <div class="font-box">
          <p class="today-num">
            {{ item.number }}
          </p>
          <p class="today-text">
            {{ item.title }}
          </p>
        </div>
        <div class="pie-chart">
          <pie-chart :ref="'pie' + index" :echartId="'pie' + index"></pie-chart>
        </div>
      </el-col>
    </el-row>

    <div class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="plat_name" label="平台名称" width="120px" ></el-table-column>
        <el-table-column prop="pub_num" label="投放任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.pub_num) + Number(scope.row.cart_pub_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="not_allot_num" label="未分配任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.not_allot_num) + Number(scope.row.cart_not_allot_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="wait_accept_num" label="未接任务数" width="150">
           <template slot-scope="scope">
            {{Number(scope.row.wait_accept_num) + Number(scope.row.cart_wait_accept_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="wait_doing_num" label="已接任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.wait_doing_num) + Number(scope.row.cart_wait_doing_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="cart_wait_commit_num" width="150" label="待完成隔日单" v-if="industry_status != CONFIG.INDUSTRY_STATUS_CLOSE"></el-table-column>
        <el-table-column prop="waiting_audit_num" label="待审核任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.waiting_audit_num) + Number(scope.row.cart_waiting_audit_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="done_num" label="已完成任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.done_num) + Number(scope.row.cart_done_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="cancel_num" label="失效任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.cancel_num ) + Number(scope.row.cart_cancel_num) }}
          </template>
        </el-table-column>
        <el-table-column prop="fail_num" label="审核失败任务数" width="150">
          <template slot-scope="scope">
            {{Number(scope.row.fail_num) + Number(scope.row.cart_fail_num)}}
          </template>
        </el-table-column>
        <el-table-column prop="time_out_num" label="已超时任务数" width="150">
        </el-table-column>
        <el-table-column prop="new_user_num" label="新增用户" width="150"></el-table-column>
        <el-table-column
          width="150"
          prop="activity_user_num"
          label="日活用户"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import PieChart from './pieChart'
import { getTodayHandler } from '@/api/dataStatistics'
export default {
  name: 'todayData',
  components: { PieChart },
  data () {
    return {
      industry_status: localStorage.getItem('industry_status'),
      tableData: [],
      boxData: [],
      boxDataOld: [
        {
          title: '投放任务数',
          pieData: [],
          number: 0,
          type: 'pub_num'
        },
        {
          title: '已完成任务数',
          pieData: [],
          number: 0,
          type: 'done_num'
        },
        {
          title: '日活用户数',
          pieData: [],
          number: 0,
          type: 'activity_user_num'
        },
        {
          title: '新增用户数',
          pieData: [],
          number: 0,
          type: 'new_user_num'
        }
      ],
      boxDataNew: [
        {
          title: '投放普通单',
          pieData: [],
          number: 0,
          type: 'pub_num'
        },
        {
          title: '已完成普通单',
          pieData: [],
          number: 0,
          type: 'done_num'
        },
         {
          title: '投放隔日单',
          pieData: [],
          number: 0,
          type: 'cart_pub_num'
        },
        {
          title: '待完成隔日单',
          pieData: [],
          number: 0,
          type: 'cart_wait_commit_num'
        },
        {
          title: '日活用户数',
          pieData: [],
          number: 0,
          type: 'activity_user_num'
        },
        {
          title: '新增用户数',
          pieData: [],
          number: 0,
          type: 'new_user_num'
        }
      ]
    }
  },

  mounted () { },
  created () {
    let boxData = this.boxDataOld
    if(this.industry_status != this.CONFIG.INDUSTRY_STATUS_CLOSE) boxData = this.boxDataNew
    this.boxData = boxData
    this.getToday()
  },
  methods: {
    // 渲染饼图
    initChart () {
      let _this = this
      _this.boxData.map((item, index) => {
        _this.$refs['pie' + index][0].propsData = { ...item }
        _this.$refs['pie' + index][0].init()
      })
    },
    getDetails () { },
    //获取今日实时数据
    async getToday () {
      let _this = this
      let data = await getTodayHandler({industry_status: this.industry_status})
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return false
      //有数据
      if (!data.result) return false
      if (data.result.plat_list && data.result.plat_list.length > 0) {
        _this.tableData = data.result.plat_list //今日数据汇总
        data.result.plat_list.map(item => {
          _this.boxData.map(i => {
            i.number += Number(item[i.type])
            i.pieData.push({ value: item[i.type], name: item.plat_name })
          })
        })
        _this.initChart()
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.pie-chart {
  width: 100%;
  height: 300px;
}
.font-box {
  text-align: center;
  p{ 
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

</style>