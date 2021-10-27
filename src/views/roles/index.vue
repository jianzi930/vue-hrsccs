<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="roles">
        <div class="role-container">
          <el-button icon="el-icon-plus" size="small" type="primary" @click="showRoleHandler({})">新增角色</el-button>
          <el-table :data="roleData" style="width: 100%" :border="true" fit>
            <el-table-column type="index" label="序号" width="80" />
            <el-table-column prop="name" label="角色名" width="180" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="150">
              <div slot-scope="{ row }">
                <a style="color:#409EFF" @click="showRoleHandler(row)">编辑 </a>
                <a style="color:#409EFF" @click="showPermAssign(row.id)">分配 </a>
                <a style="color:#409EFF" @click="showConfirmHandler(row.id)"> 删除</a>
              </div>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="page.page"
            :page-sizes="[2, 5, 10]"
            :page-size="page.pagesize"
            layout="total, sizes, prev, pager, next, ->"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <PermissionAssign
      v-if="permAssignShow"
      :dialog-show.sync="permAssignShow"
      :role-id="permAssignRoleId"
      @dialogConfrim="permAssignShow=false"
    />
    <RoleDialog
      :dialog-show.sync="dialogShow"
      :title="dialogTitle"
      :form="currentRoleData"
      @addAndEidtRole="addAndEidtRoleHandler"
    />
    <ConfirmDialog
      text="确定删除角色吗？"
      :dialog-show.sync="confirmDialogShow"
      @dialogConfrim="deletRole"
    />
  </div>
</template>

<script>
import PermissionAssign from './compontents/permissionAssign.vue'
import RoleDialog from './compontents/roleDialog'
import { getRoleListApi, deleteRoleApi } from '@/api/roles'
export default {
  components: {
    PermissionAssign,
    RoleDialog
  },
  data() {
    return {
      activeName: 'roles',
      roleData: [], // 所有角色数据
      currentRoleData: {}, // 新增、修改角色弹窗中表单的数据
      dialogShow: false, // 新增、修改角色弹窗
      dialogTitle: '新增角色', // 新增、修改角色弹窗的title
      confirmDialogShow: false, // 确认修改弹窗
      currentCconfirmId: '', // 删除的角色的id
      permAssignShow: false, // 分配权限弹窗
      permAssignRoleId: '', // 当前要分配权限的Id
      page: {
        page: 1, // 当前第几页
        pagesize: 5, // 每页显示的条数
        total: 10 // 一共多少数据
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      await getRoleListApi(this.page)
        .then(res => {
          this.roleData = res.rows
          this.page.total = res.total
        })
        .catch(() => { this.$message.error('获取失败') })
    },
    // 点击修改、新增角色
    showRoleHandler(data) {
      this.dialogShow = true // 显示对话框
      this.dialogTitle = Object.keys(data).length > 0 ? '修改角色' : '新增角色'
      this.currentRoleData = data
    },
    // 新增、修改角色后更新数据
    addAndEidtRoleHandler() {
      this.dialogShow = false
      this.getRoleList()
    },
    // 点击分配按钮
    showPermAssign(id) {
      this.permAssignShow = true
      this.permAssignRoleId = id
    },
    // 点击删除角色
    showConfirmHandler(id) {
      this.confirmDialogShow = true // 删除提示框显示
      this.currentCconfirmId = id
    },
    // 确定删除角色
    async deletRole() {
      this.confirmDialogShow = false // 删除提示框隐藏
      await deleteRoleApi(this.currentCconfirmId)
        .then(() => {
          this.$message.success('删除成功')
          this.getRoleList()
        })
        .catch(() => { this.$message.error('删除失败') })
    },
    // 切换每页条数
    handleSizeChange(val) {
      this.page.pagesize = val
      this.getRoleList()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.page.page = val
      this.getRoleList()
    }
  }
}
</script>

<style  lang="scss" scoped>
.role-container {
  padding: 20px 40px;
  .el-table {
    margin: 15px 0;
  }
  .el-dialog__wrapper {
    .el-dialog {
      height: 80vh;
      .el-dialog-body {
        height: calc(100% - 116px);
        overflow-y: auto;
      }
    }
  }
}
</style>
