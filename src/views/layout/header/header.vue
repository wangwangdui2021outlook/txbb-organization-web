<template>
  <div class="header-container">
    <div class="header-content">
      <el-row class="header-left">
        <i
          @click="closeMenu"
          :class="menuFlag ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
          class="icon iconfont"
        ></i>
        <h2>{{ $route.meta.title }}</h2>
      </el-row>
      <div class="header-right">
        <p v-if="userInfo.organ_manager_phone">
           <span>{{userInfo.organ_manager_name}}</span>
           <span>&nbsp;({{userInfo.organ_manager_phone}})</span>
        </p>
        <el-divider direction="vertical"></el-divider>
        <el-link @click="dialogFormVisible = true" :underline="false"
          >修改密码</el-link
        >
        <el-divider direction="vertical"></el-divider>
        <el-link @click="logout()" :underline="false">退 出</el-link>
      </div>
    </div>

    <el-row class="dialog-row">
      <el-dialog title="修改密码" width="500px" :visible.sync="dialogFormVisible">
        <el-form
          :model="modifyPass"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
        >
          <el-form-item label="旧密码" prop="old_password">
            <el-input
              v-model="modifyPass.old_password"
              type="password"
              placeholder="请输入旧密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="modifyPass.password"
              type="password"
              placeholder="请输入新密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="password_check">
            <el-input
              v-model="modifyPass.password_check"
              type="password"
              placeholder="请再次确认新密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定修改</el-button
          >
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { changePasswordHandler } from '@/api/login'
export default {
  data () {
    return {
      menuFlag: true,
      userInfo: this.$store.state.userInfo? this.$store.state.userInfo : {},
      breadcrumd: [],
      dialogFormVisible: false,
      modifyPass: {},
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能低于 6 位', trigger: 'blur' }
        ],
        password_check: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能低于 6 位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {},
  methods: {
    closeMenu () {
      this.menuFlag = !this.menuFlag
      this.$emit('changMenuStatus', this.menuFlag)
    },
    filterRoutes (routes) {
      let homeRoute = [{ path: '/', meta: { title: '' } }]
      if (routes.some(route => route.path === '')) {
        return routes.filter(item => {
          if (item.path === '') return false
          return true
        })
      } else {
        routes = routes.filter(route => {
          if (!route.meta.title) return false
          return true
        })
        return homeRoute.concat(routes)
      }
    },
    // 退出登录
    logout () {
      this.$confirm('确定要退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        this.$store.dispatch('Logout').then(() => {
          _this.$router.push({ path: `/login?time=${new Date().getTime()}` })
        })
      }).catch(() => { })
    },
    // 修改密码
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        if (this.modifyPass.password !== this.modifyPass.password_check) return this.$message.error('两次密码输入不一致，请重新确认')
        const param = {
          old_password: this.modifyPass.old_password,
          new_password: this.modifyPass.password
        }
        const data = await changePasswordHandler(param)
        if (data.code !== this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        this.$alert(data.msg, '提示', {
          confirmButtonText: '重新登录',
          type: 'success',
          center: true,
          showClose: false,
          callback: () => {
            this.$store.dispatch('Logout').then(() => {
              this.$router.push({ path: `/login?time=${new Date().getTime()}` })
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scope>
.header-container {
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    padding: 0 10px 0 0;
   
  }
  .header-left {
    display: flex;
    align-items: center;
    .el-breadcrumb {
      font-size: 26px;
      font-weight: 600;
      color: #000;
    }
  }
  .icon {
    display: inline-block;
    width: 50px;
    height: 50px;
    color: #333;
    font-size: 26px;
    text-align: center;
    line-height: 50px;
    margin-right:10px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
    }
  }
  .header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    .el-link {
      font-size: 18px;
      font-weight: 600; 
      &:hover {
        @include color_link();
      }
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.38s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(5px);
  opacity: 0;
}
</style>
