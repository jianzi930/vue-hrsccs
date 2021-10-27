<template>
  <el-dialog title="分配权限" class="dialog" :visible="dialogShow" top="10vh" @close="btnPermCancel">
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      :show-checkbox="true"
      :check-strictly="true"
      :default-expand-all="true"
      :default-checked-keys="selectCheck"
      node-key="id"
    />
    <!-- 确定 取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
      <el-button size="small" @click="btnPermCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionListApi } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { getRoleDetailApi, assignPermApi } from '@/api/roles'
export default {
  name: 'PermissionAssign',
  props: {
    dialogShow: {
      type: Boolean
    },
    roleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [] // 定义一个数组来接收 已经选中的节点
    }
  },
  created() {
    this.getPermission()
  },
  methods: {
    // 获取权限数据
    async getPermission() {
      this.permData = tranListToTreeData(await getPermissionListApi(), '0') // 获取并转化所有权限数据到树形数据
      const { permIds } = await getRoleDetailApi(this.roleId) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
    },
    // 保存分配的权限
    async btnPermOK() {
      await assignPermApi({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.$emit('dialogConfrim')
    },
    // 取消和关闭
    btnPermCancel() {
      this.$emit('update:dialogShow', false)
    }
  }
}

</script>
<style lang='scss'>
.dialog {
  .el-dialog {
    height: 80vh;
    .el-dialog__body {
      height: calc(100% - 116px);
      overflow-y: auto;
    }
  }
}
</style>
