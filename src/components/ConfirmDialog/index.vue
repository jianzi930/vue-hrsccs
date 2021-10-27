<template>
  <el-dialog
    title="提示"
    :visible="dialogShow"
    :show-close="false"
  >
    <div>{{ text }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogShow', false)">取 消</el-button>
      <el-button type="primary" @click="$emit('dialogConfrim')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Confirmdialog',
  props: {
    text: {
      type: String,
      default: () => ''
    },
    dialogShow: {
      type: Boolean
    }
  }
}
</script>
