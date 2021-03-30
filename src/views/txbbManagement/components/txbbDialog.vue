<template>
  <div>
    <el-dialog
      :title="title ? '编辑平台信息' : '添加新的平台'"
      :visible.sync="addVisible"
      :close-on-click-modal="false"
      width="550px"
    >
      <el-row>
        <el-form
          :model="addForm"
          label-width="100px"
          label-position="right"
          size="small"
          ref="addForm"
          :rules="addRules"
        >
          <el-form-item label="平台名称:" prop="plat_name">
            <el-input v-model="addForm.plat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="负责人姓名:" prop="plat_manager_name">
            <el-input
              v-model="addForm.plat_manager_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录手机号:" prop="plat_manager_phone">
            <el-input
              v-model="addForm.plat_manager_phone"
              autocomplete="off"
              :disabled="title ? true : false"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="行业版权限" v-if="!title && industry_status_golb != CONFIG.INDUSTRY_STATUS_CLOSE">
            <el-radio v-model="addForm.industry_status" :label="CONFIG.INDUSTRY_STATUS_OPEN">{{CONFIG.INDUSTRY_STATUS(CONFIG.INDUSTRY_STATUS_OPEN)}}</el-radio>
            <el-radio v-model="addForm.industry_status" :label="CONFIG.INDUSTRY_STATUS_CLOSE">{{CONFIG.INDUSTRY_STATUS(CONFIG.INDUSTRY_STATUS_CLOSE)}}</el-radio>
            <el-radio v-model="addForm.industry_status" :label="CONFIG.INDUSTRY_STATUS_NOT">{{CONFIG.INDUSTRY_STATUS(CONFIG.INDUSTRY_STATUS_NOT)}}</el-radio>
          </el-form-item> -->
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddOrg('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 新增平台成功 -->
    <el-dialog
      class="initialize-dialog"
      :visible.sync="initializeVisible"
      width="450px"
      title="新平台添加成功"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-row v-if="platform">
        <el-form label-width="150px">
          <el-form-item label="已成功添加平台：">
            <span>{{ platform.plat_name }}</span>
          </el-form-item>
          <el-form-item label="登录手机号：">
            <span>{{ platform.user_name }}</span>
          </el-form-item>
          <el-form-item label="初始随机密码：">
            <span style="margin-right:20px;">{{ platform.password }}</span>
            <el-button
              round
              size="mini"
              type="primary"
              plain
              v-clipboard:copy="platform.password"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              >点击复制</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="closeInitialize">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 重置密码弹框 -->
    <el-dialog
      class="reset-password-dialog"
      :visible.sync="resetVisible"
      width="450px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <el-row>
        <p class="reset-success">已将该账号成功重置密码</p>
        <div class="reset-content">
          <span class="reset-title">当前随机密码：</span>
          <span class="reset-text">{{ resetPassword }}</span>
          <el-button
            round
            size="mini"
            type="primary"
            plain
            v-clipboard:copy="resetPassword"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            >点击复制</el-button
          >
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="resetVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createPlatHandler, updatePlatHandler } from '@/api/txbbManagement';
export default {
  name: 'txbbDialog',
  data () {
    return {
      id: '',
      title: true,
      initializeVisible: false, //平台初始密码弹框
      addVisible: false, //添加新平台弹框的展示
      resetVisible: false, //重置密码弹框
      resetPassword: '',
      addForm: {
        plat_name: '',
        plat_manager_name: '',
        plat_manager_phone: '',
        industry_status: NaN
      },
      industry_status_golb: localStorage.getItem('industry_status'),
      platform: {}, //初始密码变量
      addRules: {
        plat_name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
        plat_manager_name: [{required: true,trigger: 'blur',message: '请输入负责人姓名'}],
        plat_manager_phone: [
          { required: true, trigger: 'blur', message: '请输入登录手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }
        ],
      },
    };
  },
  mounted () { },
  methods: {
    //确定 新增 编辑
    sureAddOrg (formName) {
      this.$refs[formName].validate(valid => {
        valid && this.createPlat()
      })
    },
    //新增平台 编辑平台
    async createPlat () {
      let _this = this
      let data = null
      let param = { ..._this.addForm }
      if(_this.industry_status_golb == _this.CONFIG.INDUSTRY_STATUS_NOT) return _this.$message.warning('暂时不能添加新平台，请联系管理员')
      param.industry_status = this.industry_status_golb 
      if (_this.title && _this.title.id) {
        //编辑
        param.plat_id = _this.encodeId(_this.title.id)
        data = await updatePlatHandler(param)
      } else {
        data = await createPlatHandler(param)
      }
      if (data.code !== _this.CONFIG.CODE_SUCCESS) return _this.$message.warning(data.msg)
      _this.addVisible = false
      if (_this.title) { // 编辑成功
        _this.$message.success(data.msg)
        _this.$emit('getPlat')
      } else { // 新增成功
        _this.initializeVisible = true //密码框提示
        _this.platform = data.result
      }
    },
    //关闭密码弹窗
    closeInitialize () {
      this.initializeVisible = false
      this.$emit('getPlat')
    },
    
    onCopy () {
      this.$message.success('已复制到剪贴板！')
    },
    onError () {
      this.$message.warning('复制失败，请稍后再试试！')
    }
  }
};
</script>
<style lang='scss' scoped>
.reset-password-dialog {
  .reset-success {
    color: #2cb82e;
    text-align: center;
    padding-bottom: 20px;
  }
  .reset-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #000;
    .reset-title {
      color: #666666;
    }
    .reset-text {
      margin-right: 15px;
    }
  }
}
</style>