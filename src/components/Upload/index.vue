<template>
  <div
    class="Upload"
    @click="uploadImg(this)"
    :style="{ 'background-image': this.showBG }"
  >
    <input
      type="file"
      @change="addImg"
      ref="inputer"
      accept="image/*"
      style="display:none"
      :id="'upload' + tid"
    />
    <img v-if="isShowImg && picSrc" :src="CDN_UP_URL + picSrc" alt="" />
  </div>
</template>

<script>
import lrz from 'lrz'
import { uploaderFileHandle } from '@/api/uploaderFile'

export default {
  props: ['tid', 'isShowImg', 'imgBackground'],
  name: 'Upload',
  data () {
    return {
      fil: null,
      picSrc: null,
      showBG: ''
    }
  },
  mounted () {
    if (this.imgBackground) {
      let img = require('@/assets/png/' + this.imgBackground)
      this.showBG = `url(${img})`
    } else {
      this.showBG = `url(${require('@/assets/png/cross.png')})`
    }
  },
  methods: {
    uploadImg () {
      var _this = this
      document.getElementById('upload' + _this.tid).click()
    },
    addImg () {
      let _this = this
      let inputDOM = _this.$refs.inputer
      // 通过DOM取文件数据
      if (!inputDOM.files[0]) return false
      _this.fil = inputDOM.files[0]
      let size = Math.floor(_this.fil.size / 1024)
      if (size > 5 * 1024) return _this.$message.warning('最大上传文件不能超过5MB')
      lrz(_this.fil, {
        width: _this.UPLOAD_IMAGE_SIZE,
        quality: _this.UPLOAD_IMAGE_QUALITY
      }).then(async results => {
        // 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
        if (!results.base64) return _this.$message.warning('上传出错！请重新登录后再尝试上传图片')
        let params = { img_base: encodeURIComponent(results.base64) }
        let data = await uploaderFileHandle(params)
        if (data.code !== _this.CONFIG.CODE_SUCCESS) return this.$message.warning(data.msg)
        _this.picSrc = data.msg
        if (!_this.isShowImg) return _this.$emit('addImg', data.msg)
        _this.$emit('addOneImg', data.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Upload {
  width: 100%;
  height: 100%;
  background-position: 0 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  margin: 0 auto;
  background-size: 100% 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
