<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :multiple="false"
      :limit="1"
      :file-list="fileList"
      :class="{disabled: fileComputed}"
      :on-change="changeHandler"
      accept="image/jpeg', 'image/gif', 'image/bmp', 'image/png"
      :before-upload="beforeUpload"
      :http-request="uploadImage"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt="头像"
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" width="35%">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDjHYZKo1xd18yYqra3F9m9Flzwd3C4fz2', // 腾讯云身份识别 ID
  SecretKey: 'oLbZGgqkNjoc8NL2SbS3MO8cplQowmLd' // 腾讯云身份密钥
})
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: []
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      console.log(2)
      return this.fileList.length === 1
    }
  },
  created() {
    console.log(1)
  },

  methods: {
    // 删除图片
    handleRemove() {
      this.fileList = []
      this.$emit('uploadImage', '')
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changeHandler(file, fileList) {
      this.fileList = [...fileList]
    },
    // 上传文件之前的钩子, 若返回 false 则停止上传
    beforeUpload(file) {
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片最大不能超过5M')
        this.fileList = []
        return false
      }
      this.showPercent = true
      return true
    },
    // 自定义的上传行为
    uploadImage(params) {
      const _this = this
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'jianzi-1307832373', // 存储桶
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, function(err, data) {
          // data返回数据之后 应该如何处理
          if (!err) {
            _this.$emit('uploadImage', 'http://' + data.Location)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.disabled .el-upload--picture-card {
  display: none
}
.el-upload-list__item {
  transition: none;
}
</style>
