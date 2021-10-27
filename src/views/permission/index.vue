<template>
  <div class="app-container">
    <!-- 靠右的按钮 -->
    <page-tools>
      <template v-slot:after>
        <el-button type="primary" size="small">添加权限</el-button>
      </template>
    </page-tools>
    <!-- 表格 -->
    <el-table :data="list" row-key="id" style="width: 100%" border>
      <el-table-column v-slot="{ row }" prop="name" label="名称">
        <i class="el-icon-folder-opened" />
        {{ row.name }}
      </el-table-column>
      <el-table-column prop="code" label="标识" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            v-if="row.type === 1"
            type="text"
            @click="permissionHandler(row.id, 'add', 2)"
          >添加</el-button>
          <el-button type="text" @click="permissionHandler(row.id, 'edit')">编辑</el-button>
          <el-button type="text" @click="delPermission(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增员工窗口 -->
    <PermissionDialog
      v-if="permissionDialogShow"
      :dialog-show.sync="permissionDialogShow"
      :form-data="formData"
      :show-text="showText"
      @confirmPermission="addAndEditPermissionHandler"
    />
    <ConfirmDialog
      text="确定删除权限吗？"
      :dialog-show.sync="confirmDialogShow"
      @dialogConfrim="delPermission"
    />
  </div>
</template>

<script>
import PermissionDialog from './components/permissionDialog.vue'
import { updatePermissionApi, addPermissionApi, getPermissionDetailApi, delPermissionApi, getPermissionListApi } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    PermissionDialog
  },
  data() {
    return {
      list: [],
      formData: {},
      showText: '',
      permissionDialogShow: false,
      confirmDialogShow: false,
      currentCconfirmId: ''
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取所有权限数据，并转为树形数据
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionListApi(), '0')
    },
    // 点击新增、修改按钮
    async permissionHandler(id, state) {
      this.permissionState = state
      if (state === 'edit') {
        this.showText = '修改'
        this.formData = await getPermissionDetailApi(id)
      } else {
        this.showText = '添加'
        this.formData = { pid: id }
      }
      this.permissionDialogShow = true
      this.currentId = id
    },
    // 保存新增、修改
    async addAndEditPermissionHandler(formData) {
      try {
        if (this.permissionState === 'edit') {
          await updatePermissionApi(formData)
        } else {
          await addPermissionApi(formData)
        }
        this.$message.success('保存成功')
        this.getPermissionList()
      } catch {
        this.$message.error('保存失败')
      }
      this.permissionDialogShow = false
    },
    // 点击删除角色
    showConfirmHandler(id) {
      this.confirmDialogShow = true // 删除提示框显示
      this.currentCconfirmId = id
    },
    // 确定删除角色
    async delPermission() {
      this.confirmDialogShow = false // 删除提示框隐藏
      await delPermissionApi(this.currentCconfirmId)
        .then(() => {
          this.$message.success('删除成功')
          this.getRoleList()
        })
        .catch(() => { this.$message.error('删除失败') })
    }
  }
}
</script>

<style>

</style>
