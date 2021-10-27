<template>
  <el-dialog :title="`${showText}权限点`" :visible="dialogShow" :show-close="false">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" type="primary" @click.native="$emit('confirmPermission', formData)">确定</el-button>
      <el-button size="small" @click="$emit('update:dialogShow', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'PermissionDialog',
  props: {
    dialogShow: {
      type: Boolean
    },
    formData: {
      type: Object,
      default: () => {}
    },
    showText: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
