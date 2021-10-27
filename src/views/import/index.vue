<template>
  <div class="app-container">
    <h3>导入文件</h3>
    <UploadFile :on-success="uploadHandler" />
  </div>
</template>

<script>
import UploadFile from '@/components/UploadFile'
import { importEmployeeApi } from '@/api/employee'
import { headerRelations } from '@/utils/excel-header'
import { formatDate } from '@/utils'
export default {
  name: 'Dashboard',
  components: {
    UploadFile
  },
  methods: {
    async uploadHandler({ header, results }) {
      // 将提取到的数据转换为接口所需数据格式
      const uploadData = []
      results.forEach(item => {
        const obj = {}
        Object.keys(item).forEach(key => {
          if (key.includes('日期')) {
            obj[headerRelations[key]] = new Date(formatDate(item[key], '/'))
            return
          }
          obj[headerRelations[key]] = item[key]
        })
        uploadData.push(obj)
      })
      // 调用上传接口
      await importEmployeeApi(uploadData)
        .then(() => {
          this.$message('导入成功')
          this.$router.back()
        })
        .catch(() => { this.$message('导入失败') })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  h3 {
    margin: 0 0 30px;
    text-align: center;
  }
  div {
    width: 360px;
    margin: 0 auto;
  }
}
</style>
