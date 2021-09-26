<template>
  <el-row type="flex" justify="space-between" align="middle" style="width:100%">
    <el-col><span>{{ nodeData.name }}</span></el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          <el-button
            type="text"
            size="mini"
          >
            {{ nodeData.manager }}
          </el-button>
        </el-col>
        <el-col style="line-height: 30px">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">修改部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TreeItem',
  props: {
    nodeData: {
      type: Object,
      require: true,
      default: () => {}
    },
    isRoot: {
      type: Boolean
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 下拉菜单操作
    handleCommand(command) {
      console.log(command)
      if (command === 'add') { // 添加部门
        this.$emit('departShow', { pid: this.nodeData.id }, '添加部门')
      }
      if (command === 'edit') { // 修改部门
        this.$emit('departShow', this.nodeData, '修改部门')
      }
      if (command === 'delete') { // 删除部门
        this.$emit('confirmShow', this.nodeData.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-col-20 {
  font-size: 14px;
  line-height: 30px;
}
.el-button--text {
  color: #606266;
  margin-right: 15px;
  font-size: 14px;
}
</style>
