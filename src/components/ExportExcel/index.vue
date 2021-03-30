<template>
  <div class="export-excel-container">
    <el-button @click="exportExcel" type="primary" round>
      <slot></slot>
    </el-button>
  </div>
</template>

<script>

/* eslint-disable */
import XLSX from 'xlsx'  // 导出插件

import { getOrganExportHandler, getPlatExportHandler } from '@/api/dataStatistics'
export default {
  name: '',
  components: {},
  props: {
    hickey: {
      type: String
    },
  },
  data () {
    return {
      tableData: [

      ]
    }
  },
  created () { },
  mounted () { },
  methods: {

    // 导出按钮判断请求那个接口
    exportExcel () {
      let _this = this
      switch (_this.hickey) {
        case 'exportDataHandler': //导出机构数据汇总
          _this.getExportData()
          break;
        case 'exportYesterDay': // 导出历史数据
          this.getExportYesterData()
        default:
          return false
          break;
      }
    },
    // 导出分销机构下平台数据
    getPlatByOrganExport () {
      // 支持多 sheet
      // const sheetData2 = data2.map(item => ({
      //   // 在这里设置表头和对应项的值
      // }));
      // const sheetData3 = data3.map(item => ({
      //   // 在这里设置表头和对应项的值
      // }));
      // ...

      const sheet1 = XLSX.utils.json_to_sheet(sheetData1);
      // 支持多 sheet
      // const sheet2 = XLSX.utils.json_to_sheet(sheetData2);
      // const sheet3 = XLSX.utils.json_to_sheet(sheetData3);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet1, '收件人列表');
      // 支持多 sheet
      // XLSX.utils.book_append_sheet(wb, sheet2, '表格 sheet2');
      // XLSX.utils.book_append_sheet(wb, sheet2, '表格 sheet2');
      const workbookBlob = this.workbook2blob(wb);
      // 导出最后的总表
      this.openDownloadDialog(workbookBlob, '收件人列表.xlsx');
    },
    // 导出历史数据 平台
    async getExportYesterData () {
      let _this = this
      let data = await getPlatExportHandler({industry_status: localStorage.getItem('industry_status')})
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      if (data.result && data.result.length) {
        let organName = []
        let sheetsDatas = []
        data.result.map((item, index) => {
          organName.push(item.plat_name) // 平台名称
          if (item.result && item.result.length) {
            let sheet = []
            // 隔日任务
            if(localStorage.getItem('industry_status') != this.CONFIG.INDUSTRY_STATUS_CLOSE){
              sheet = item.result.map((item) => ({
                '日期': item.date,
                '投放任务数': Number(item.task_num) + Number(item.cart_task_num),
                '待完成隔日单': item.cart_wait_commit_task_num,
                '待审核任务数': Number(item.audit_task_num) + Number(item.cart_audit_task_num),
                '已完成任务数': Number(item.finish_task_num) + Number(item.cart_finish_task_num),
                '失效任务数':Number(item.cancel_task_num) + Number(item.cart_cancel_task_num),
                '审核失败任务数':Number(item.fail_task_num) + Number(item.cart_fail_task_num),
                '已超时任务数': item.time_out_task_num,
                '新增用户': item.reg_num,
                '月活用户': item.active_num,
                '总用户数': item.all_reg_num,
                '任务完成率': item.task_num == 0 ? '0.00%' : ((Number(item.finish_task_num) + Number(item.cart_finish_task_num)) * 100 / (Number(item.task_num) + Number(item.cart_task_num))).toFixed(2) + '%'
              }))
            }else{
              sheet = item.result.map((item) => ({
              '日期': item.date,
              '投放任务数': Number(item.task_num),
              '待审核任务数': Number(item.audit_task_num),
              '已完成任务数': Number(item.finish_task_num),
              '失效任务数':Number(item.cancel_task_num),
              '审核失败任务数':Number(item.fail_task_num),
              '已超时任务数': item.time_out_task_num,
              '新增用户': item.reg_num,
              '月活用户': item.active_num,
              '总用户数': item.all_reg_num,
              '任务完成率': item.task_num == 0 ? '0.00%' : (item.finish_task_num * 100 / item.task_num).toFixed(2) + '%'
            }))
            }
            sheetsDatas.push(sheet)
          }
        })
        const wb = XLSX.utils.book_new();
        const param = sheetsDatas.map((item) => {
          return XLSX.utils.json_to_sheet(item)        })
        param.map((item, index) => {
          XLSX.utils.book_append_sheet(wb, item, organName[index])
        })
        const workbookBlob = _this.workbook2blob(wb)
        // 导出最后的总表
        _this.openDownloadDialog(workbookBlob, '历史数据.xlsx')
      } else {
        _this.$message.warning('暂无数据')
      }
    },
    //导出机构数据汇总 分销
    async getExportData () {
      let _this = this
      let data = await getOrganExportHandler({industry_status: localStorage.getItem('industry_status')})
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      if (data.result.result && data.result.result.length) {
        let sheetData = []
        if(localStorage.getItem('industry_status') != this.CONFIG.INDUSTRY_STATUS_CLOSE){
          sheetData = data.result.result.map((item) => ({
            '日期': item.date,
            '投放任务数': Number(item.task_num) + Number(item.cart_task_num),
            '待完成隔日单': item.cart_wait_commit_task_num,
            '待审核任务数': Number(item.audit_task_num) + Number(item.cart_audit_task_num),
            '已完成任务数': Number(item.finish_task_num) + Number(item.cart_finish_task_num),
            '失效任务数':Number(item.cancel_task_num) + Number(item.cart_cancel_task_num),
            '审核失败任务数':Number(item.fail_task_num) + Number(item.cart_fail_task_num),
            '已超时任务数': item.time_out_task_num,
            '新增用户': item.reg_num,
            '月活用户': item.active_num,
            '总用户数': item.all_reg_num,
            '任务完成率': item.task_num == 0 ? '0.00%' : ((Number(item.finish_task_num) + Number(item.cart_finish_task_num)) * 100 / (Number(item.task_num) + Number(item.cart_task_num))).toFixed(2) + '%'
          }))
        }else{
          sheetData = data.result.result.map((item) => ({
            '日期': item.date,
            '投放任务数': Number(item.task_num),
            '待审核任务数': Number(item.audit_task_num),
            '已完成任务数': Number(item.finish_task_num),
            '失效任务数':Number(item.cancel_task_num),
            '审核失败任务数':Number(item.fail_task_num),
            '已超时任务数': item.time_out_task_num,
            '新增用户': item.reg_num,
            '月活用户': item.active_num,
            '总用户数': item.all_reg_num,
            '任务完成率': item.task_num == 0 ? '0.00%' : ((Number(item.finish_task_num)) * 100 / (Number(item.task_num))).toFixed(2) + '%'
          }))
        }
        const sheet = XLSX.utils.json_to_sheet(sheetData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, sheet, 'sheet')
        const workbookBlob = _this.workbook2blob(wb)
        // 导出最后的总表
        _this.openDownloadDialog(workbookBlob, '机构数据.xlsx')
      } else {
        _this.$message.warning('暂无数据')
      }
    },
    // 将workbook 装化成blob对象
    workbook2blob (workbook) {
      // 生成excel的配置项
      var wopts = {
        // 要生成的文件类型
        bookType: "xlsx",
        // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: "binary"
      };
      var wbout = XLSX.write(workbook, wopts);
      // 将字符串转ArrayBuffer
      function s2ab (s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
      });
      return blob;
    },
    // 导出事件
    openDownloadDialog (blob, fileName) {
      if (typeof blob == "object" && blob instanceof Blob) {
        blob = URL.createObjectURL(blob); // 创建blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = blob;
      // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
      aLink.download = fileName || "";
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      //   移动端
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      }
      aLink.dispatchEvent(event);
    }
  }
}
</script>

<style lang="scss" scoped>
.export-excel-container {
  display: inline-block;
}

</style>
