<template>
  <el-dialog title="分配角色" :visible="roleDialogShow" :show-close="false">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" size="small" @click="updateAssignRoles">确定</el-button>
      <el-button size="small" @click="$emit('update:roleDialogShow', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleListApi } from '@/api/roles'
import { getUserDetailByIdApi } from '@/api/user'
import { updateAssignRolesApi } from '@/api/employee'
export default {
  name: 'RoleAssign',
  props: {
    roleDialogShow: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: [] // 已经分配的角色
    }
  },
  created() {
    this.getRoleList()
    this.getUserDetailById()
  },
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleListApi()
      this.list = rows
    },
    // 获取该用户的角色
    async getUserDetailById() {
      const { roleIds } = await getUserDetailByIdApi(this.userId)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    // 保存分配的角色
    async updateAssignRoles() {
      await updateAssignRolesApi({ id: this.userId, roleIds: this.roleIds })
        .then(() => {
          this.$message.success('保存成功')
        })
        .catch(() => { this.$message.error('保存失败') })
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

