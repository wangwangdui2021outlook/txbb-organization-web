<template>
  <div>
    <h1 style="text-align:center">欢迎来到{{ PLAT_NAME }}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.content-ident {
  margin: 0 0 0 30px;
}
.overview-num {
  margin: 20px 0 0 0;
  .overview-box {
    font-size: 20px;
    text-align: center;
  }
}
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  color: #888;
  font-size: 26px;
}
</style>
