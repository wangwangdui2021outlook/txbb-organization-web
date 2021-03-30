<template>
  <div>
    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls"
      @change="handleClick"
    />
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      <i class="el-icon-upload icon-font"></i>
      将订单excel文件拖拽致此 或
      <el-button
        :loading="loading"
        style="margin-left:16px;"
        size="mini"
        type="primary"
        @click="handleUpload"
        icon="el-icon-upload"
      >
        点击上传
      </el-button>
    </div>

    <el-dialog title="提示" :visible.sync="loading" width="30%">
      <span>正在解析文件中</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data () {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    generateData ({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      // if (files.length !== 1) {
      //   this.$message.error('只允许上传一个文件!')
      //   return
      // }
      for (let i = 0; i < files.length; i++) {
        const rawFile = files[i] // only use files[0]
        if (!this.isExcel(rawFile)) {
          this.$message.error('上传文件类型只能是： .xlsx, .xls, .csv ')
          return false
        }
        this.upload(rawFile)
      }
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload () {
      this.$refs['excel-upload-input'].click()
    },
    handleClick (e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const rawFile = files[i] // only use files[0]
        if (!rawFile) return
        this.upload(rawFile)
      }
    },
    upload (rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData (rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = require('xlsx').read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = require('xlsx').utils.sheet_to_json(worksheet, { defval: '', header: 1, raw: false })
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow (sheet) {
      const headers = []
      const range = require('xlsx').utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[require('xlsx').utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = require('xlsx').utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel (file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.icon-font {
  font-size: 30px;
}
</style>
