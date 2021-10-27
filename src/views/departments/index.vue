<template>
  <div class="app-container">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="组织架构" name="depart">
          <div class="depart-container">
            <TreeItem :is-root="true" :node-data="titleData" class="tree-title" />
            <el-divider />
            <el-tree
              :data="departments"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <TreeItem
                slot-scope="{ data }"
                :node-data="data"
                :is-root="false"
                @departShow="showDepartHandler"
                @confirmShow="showConfirmHandler"
              />
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
      <DepartDialog
        v-if="departDdialogShow"
        :dialog-show.sync="departDdialogShow"
        :form="currentDepartData"
        :title="dialogTitle"
        @addAndEidtDepart="addAndEidtDepartHandler"
      />
      <ConfirmDialog
        text="确定删除部门吗？"
        :dialog-show.sync="confirmDialogShow"
        @dialogConfrim="deleteDepartments"
      />
    </div>
  </div>
</template>

<script>
import TreeItem from './components/treeItem'
import DepartDialog from './components/departDialog'
import { getDepartmentsApi, deleteDepartmentsApi } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeItem,
    DepartDialog
  },
  data() {
    return {
      activeName: 'depart',
      titleData: {
        id: 0,
        name: '科技股份有限公司',
        manager: '负责人'
      },
      departments: [],
      departDdialogShow: false,
      dialogTitle: '',
      currentDepartData: {},
      confirmDialogShow: false,
      currentCconfirmId: ''
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    // 获取所有部门
    async loadDepartments() {
      const resule = await getDepartmentsApi()
      this.departments = tranListToTreeData(resule.depts, '')
    },
    // 点击添加、修改部门
    showDepartHandler(data, title) {
      this.departDdialogShow = true
      this.dialogTitle = title
      this.currentDepartData = data
    },
    // 确定添加、修改部门
    addAndEidtDepartHandler() {
      this.departDdialogShow = false
      this.loadDepartments()
    },
    // 点击删除部门
    showConfirmHandler(id) {
      this.confirmDialogShow = true // 删除提示框显示
      this.currentCconfirmId = id
    },
    // 确定删除部门
    async deleteDepartments() {
      this.confirmDialogShow = false // 删除提示框隐藏
      await deleteDepartmentsApi(this.currentCconfirmId)
        .then(() => {
          this.$message.success('删除成功')
          this.loadDepartments()
        })
        .catch(() => { this.$message.error('删除失败') })
    }
  }
}
</script>

<style lang="scss" scoped>
.depart-container {
  padding: 40px 60px;
  .el-divider--horizontal {
    margin: 15px 0;
  }

}
</style>
