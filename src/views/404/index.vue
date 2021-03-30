<template>
  <div class="no-container">
    <img :src="imgur" alt="" class="nofond-img" />
    <br />
    <br />
    <el-button @click="goToHome">返回首页</el-button>
  </div>
</template>

<script>
import imgur from '@/assets/png/404.gif'
export default {
  name: '',
  data () {
    return {
      imgur: imgur
    }
  },

  mounted () { },

  methods: {
    goToHome () {
      this.$router.push('/')
    }
  }
}
</script>
<style lang='scss' scoped>
.no-container {
  text-align: center;
  padding-top: 150px;
  .nofond-img {
    width: 400px;
    margin: 0 auto;
  }
}
</style>
