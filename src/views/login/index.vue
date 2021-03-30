<template>
  <el-container class="login">
    <el-form v-if="isShow" class="login-form" :model="form" ref="form" :rules="rules">
      <h2 class="title">{{ PLAT_NAME }}</h2>
      <br />
      <el-form-item prop="phone_number">
        <el-input
          v-model="form.phone_number"
          :autofocus="true"
          placeholder="请输入登陆账号"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="passwd">
        <el-input
          v-model="form.passwd"
          @keyup.enter.native="getLogin"
          type="password"
          placeholder="请输入登陆密码"
          prefix-icon="el-icon-unlock"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('form')" round>登陆</el-button>
      </el-form-item>
    </el-form>
    
    <div class="login-form select-version" v-else>
      <h2 class="select-title">请选择登陆版本</h2>
      <div class="selet-box">
        <p :class="item.className" v-for="item in versionType" :key="item.value" @click="choiseLogin(item.value)">
         {{item.name}}
        </p>
      </div>
    </div>
  </el-container>
</template>

<script>
/* eslint-disable */
export default {
  name: 'login',
  data () {
    return {
      isShow: true,
      versionType:[
        {name:'进入SaaS版',value:'Saas',className:'saas-item'},
        {name:'进入行业版',value:'Industry',className:'industry-item'},
      ],
      form: {
        phone_number: '',
        passwd: ''
      },
      rules: {
        phone_number: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' }
        ]
      },
      msg: '',
      industry_status: NaN
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate((valid) => {
        valid && this.getLogin()
      })
    },
    getLogin () {
      const _this = this
      let data = _this.form
      _this.$store.dispatch('Login', data).then(res => {
        _this.msg = res.msg
        _this.industry_status = res.result.industry_status
        if(res.result.industry_status != _this.CONFIG.INDUSTRY_STATUS_CLOSE) return _this.isShow = false
        _this.choiseLogin('Saas')
      }).catch(err => {
        _this.$message.error(err)
      })
    },
    choiseLogin (isSaas) {
      if(isSaas == 'Saas'){
        localStorage.setItem('industry_status', this.CONFIG.INDUSTRY_STATUS_CLOSE)
      }else{
        localStorage.setItem('industry_status', this.CONFIG.INDUSTRY_STATUS_OPEN)
      }
      this.$message.success(this.msg)
      this.$router.push({ path: '/' })
      
    }
  }
}
</script>

<style scoped lang="scss">
.iconfont {
  vertical-align: 0;
}
.login {
  width: 100%;
  height: 100%;
  background: url("~@/assets/png/loginBg.png");
  background-size: 100% 100%;
  .login-form {
    width: 400px;
    height: 402px;
    position: fixed;
    top: -10%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #fff;
    border-radius: 10px;
    padding: 40px;
    padding-bottom: 0px;
    .title {
      color: #000000;
      text-align: left;
      margin-bottom: 50px;
    }
    button {
      width: 100%;
    }
    .el-form-item__content {
      line-height: 0;
    }
  }
  .select-version{
    width: 655px;
    height:330px;
    box-shadow:0px 10px 24px 0px rgba(0,0,0,0.05);
    border-radius:6px;
    .select-title{
      font-size:22px;
      font-weight:500;
      color:rgba(0,0,0,1);
      text-align: center;
      margin-top:40px;
    }
    .selet-box{
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      align-items: center;
      margin-top:70px;
      padding:0 20px;
      p{
        width:200px;
        height:50px;
        border-radius:25px;
        text-align: center;
        line-height: 50px;
        color:#fff;
        font-size:17px;
        cursor: pointer;
      }
    }
    .saas-item{
      background-color:#FF9700;
    }
    .industry-item{
      background-color:#FF5C59;
    }
  }
}
</style>
