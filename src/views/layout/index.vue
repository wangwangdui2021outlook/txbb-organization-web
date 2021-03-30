<template>
  <el-container class="main-wrap">
    <el-aside :class="menuStatus ? 'is-open' : 'is-close'">
      <p :style="style" style="color:#fff;margin:0;">{{ PLAT_NAME }}</p>
      <navs :menuStatus="menuStatus" :asyncRouter="routes" />
    </el-aside>
    <el-container class="main-container">
      <el-header class="main-header" style="height:100px">
        <headers @changMenuStatus="changMenuStatus" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import navs from '@/views/layout/nav/nav'
import headers from '@/views/layout/header/header'
import Config from '@/util/common'
import { testRouter } from '@/router'
export default {
  components: {
    navs: navs,
    headers: headers
  },
  data () {
    return {
      menuStatus: true,
      Config: Config,
      style: ''
    }
  },
  watch: {
    menuStatus (val) {
      this.style = val ? '' : 'display:none'
    }
  },
  computed: {
    routes () {
      return testRouter
    }
  },
  mounted () {
  },
  methods: {
    changMenuStatus (flag) {
      this.menuStatus = flag
    }
  }
}
</script>

<style lang="scss" >
.el-button--primary.is-plain{
  color: #333333;
}
.el-button--primary{
   @include bg_btn();
   &:hover{
    @include bg_btn();
    opacity: 0.85;
   }
   &:active{
    @include bg_btn();
    opacity: 0.85;
   }  
   &:focus{
    @include bg_btn();
    opacity: 0.85;
   }
}

.main-wrap {
  width: 100%;
  height: 100%;
  .el-aside {
    width: 250px !important;
    max-width: 270px;
    height: 100%;
    background-color: #41454b;
    p {
      background: #41454b;
      color: #41454b;
      font-size: 27px;
      font-weight: 800;
      padding: 30px 5px;
      text-align: center;
    }
  }
  .el-aside {
    transition: all 0.5s;
  }
  .is-close {
    width: 64px !important;
  }
  .main-container {
    height: 100%;
    overflow-x: auto;
    .main-header {
      min-width: 1320px;
    }
  }
  .el-main {
    min-width: 1320px;
    overflow-x: hidden;
    padding: 40px;
    background-color: #f5f6fa;
  }
}
</style>
