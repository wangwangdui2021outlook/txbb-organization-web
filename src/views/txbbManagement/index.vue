<template>
  <div>
    <el-row>
      <el-button type="primary" round @click="addOrganization()"
        >添加新的平台</el-button
      >
    </el-row>
    <el-row class="table-box organ-table" v-if="tableData.length > 0">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="plat_name" label="平台名称"></el-table-column>
        <el-table-column prop="plat_manager_name" label="负责人">
        </el-table-column>
        <el-table-column prop="plat_manager_phone" label="登录手机号">
        </el-table-column>
        <el-table-column prop="gmt_create" label="创建时间">
          <template slot-scope="scope">
            <p v-html="trimText(scope.row.gmt_create)"></p>
          </template>
        </el-table-column>
        <el-table-column label="异地登陆提醒" width="110" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.other_place == CONFIG.STATUS_FALSE ? "关闭" : "开启"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="formatter"
          width="70"
        >
        </el-table-column>
        <el-table-column label="操作" width="500" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="warning"
              size="small"
              @click="addOrganization(scope.row)"
              round
              >编辑平台</el-button
            >
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="info"
              size="small"
              @click="resetPwd(scope.row.staff_id)"
              round
              >重置密码</el-button
            >
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="danger"
              size="small"
              @click="stopOriganization(scope.row.id, CONFIG.STATUS_ABLE)"
              round
              >停用</el-button
            >
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_DISABLE"
              type="danger"
              size="small"
              @click="stopOriganization(scope.row.id, CONFIG.STATUS_DISABLE)"
              round
              >恢复使用</el-button
            >
            <el-button
              v-if="scope.row.status == CONFIG.STATUS_ABLE"
              type="success"
              size="small"
              @click="
                showLoginDialog(scope.row.staff_id, scope.row.other_place)
              "
              round
              >设置异地登陆</el-button
            >
            <el-button
              v-if="
                scope.row.status == CONFIG.STATUS_ABLE &&
                  scope.row.other_place == CONFIG.STATUS_ING
              "
              type="warning"
              size="small"
              @click="
                removeOtherLogin(scope.row.staff_id, scope.row.ip_location)
              "
              round
              >解除异地登陆</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <div v-else class="no-data">
      <h2 class="ta-c" v-cloak>
        暂无数据
      </h2>
    </div>

    <txbb-dialog ref="txbbDialog" @getPlat="delayUpdate"></txbb-dialog>

    <el-dialog title="设置异地登陆" width="450px" :visible.sync="setLoginVisible">
      <div class="setlogin-content" style="text-align: center">
        <el-radio-group v-model="loginStatus">
          <el-radio :label="CONFIG.STATUS_FALSE">关闭 (默认)</el-radio>
          <el-radio :label="CONFIG.STATUS_TRUE">开启</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setLoginVisible = false">取 消</el-button>
        <el-button type="primary" @click="setOtherPlace">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { getPlatListHandler, resetPasswordHandler, blockPlatHandler, recoverPlatHandler, setOtherPlaceHandler, clearOtherPlaceHandler } from "@/api/txbbManagement";
import txbbDialog from "./components/txbbDialog"

export default {
  components: { txbbDialog },
  data () {
    return {
      setLoginVisible: false,
      staffId: '',
      loginStatus: 0,
      currentPage: 1,
      pageSize: this.PAGE_SIZE,
      totalPage: '',
      isIdDialog: {},
      tableData: []
    }
  },
  created () {
    this.getPlatList()
  },
  mounted () { },
  methods: {
    //选择每页显示条数 
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getPlatList()
    },
    //选择页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.getPlatList()
    },
    //自定义转换状态
    formatter (row) {
      return this.CONFIG.PLAT_STATUS(row.status)
    },
    //平台列表
    async getPlatList () {
      let _this = this;
      let params = {
        page: this.currentPage,
        page_size: this.pageSize,
        industry_status: localStorage.getItem('industry_status')
      }
      let data = await getPlatListHandler({ ...params })
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return false
      _this.tableData = data.result
    },
    // 添加机构 编辑
    addOrganization (item) {
      let txbbDialog = this.$refs.txbbDialog
      txbbDialog.title = item ? item : ''
      txbbDialog.addVisible = true
      Object.keys(txbbDialog.addForm).forEach(key => {
        txbbDialog.addForm[key] = item ? item[key] : ''
      });
      txbbDialog.addForm.industry_status = item? item.industry_status : this.CONFIG.INDUSTRY_STATUS_CLOSE
    },
    resetPwd (id) {
      this.$confirm('此操作将重置该账号的登录密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = { staff_id: this.encodeId(id) }
        let data = await resetPasswordHandler(params)
        if (data.code !== this.CONFIG.CODE_SUCCESS)
          return this.$message.warning(data.msg)
        this.$refs.txbbDialog.resetVisible = true
        this.$refs.txbbDialog.resetPassword = data.result.password
      }).catch(() =>{})
    },
    stopOriganization (id, status) {
      let _this = this;
      let title =
        status === _this.CONFIG.STATUS_ABLE
          ? '是否将该平台停用，停用后该平台的员工将无法登录?'
          : '确认将该平台恢复使用'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        let params = {
          plat_id: _this.encodeId(id)
        }
        let data = null
        if (status === _this.CONFIG.STATUS_ABLE) {
          // 停用
          data = await blockPlatHandler(params);
        } else {
          // 恢复使用
          data = await recoverPlatHandler(params)
        }
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$message.success(data.msg)
        _this.tableData.map((item) => {
          if (item.id === id) return item.status = status === _this.CONFIG.STATUS_ABLE ? _this.CONFIG.STATUS_DISABLE : _this.CONFIG.STATUS_ABLE
        })
      }).catch(() => { })
    },
    // 数据修改延迟重新更新接口
    delayUpdate () {
      let loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this.getPlatList()
      }, this.DELAY_TIME)
    },
    // 显示设置异地登陆蒙版
    showLoginDialog (id, status) {
      this.setLoginVisible = true
      this.staffId = id
      this.loginStatus = status == this.CONFIG.STATUS_FALSE ? status : this.CONFIG.STATUS_TRUE
    },
    // 确认异地登陆设置
    async setOtherPlace () {
      let _this = this
      let params = {
        staff_id: _this.encodeId(_this.staffId),
        other_place: _this.loginStatus
      }
      let data = await setOtherPlaceHandler({ ...params })
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.$message.success(data.msg)
      _this.setLoginVisible = false
      _this.tableData.map((item) => {
        if (item.staff_id === _this.staffId) return item.other_place = _this.loginStatus
      })
    },
    //解除异地登陆
    removeOtherLogin (id, status) {
      let _this = this
      _this.staffId = id
      let title = `该账户当前已在异地登陆--${status}，是否登录解除？`
      _this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let params = { staff_id: _this.encodeId(id) }
        let data = await clearOtherPlaceHandler({ ...params })
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
        _this.$message.success(data.msg)
        _this.delayUpdate()
      }).catch(() => { })
    }
  }
};
</script>

<style lang="scss" scope>
.organ-table{
  *{
    margin: 0 ;
    padding: 0 ;
  }
}
</style>
