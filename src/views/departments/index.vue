<template>
  <div class="depart-container">
    <div class="block">
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
</template>

<script>
import TreeItem from './components/treeItem'
import DepartDialog from './components/departDialog'
import ConfirmDialog from './components/confirmDialog'
import { getDepartmentsApi, deleteDepartmentsApi } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeItem,
    DepartDialog,
    ConfirmDialog
  },
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      titleData: {
        id: 0,
        name: '科技股份有限公司',
        manager: '负责人'
      },
      treeData: JSON.parse(JSON.stringify(data)),
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
  padding: 40px 120px;
  .el-divider--horizontal {
    margin: 15px 0;
  }

}
</style>
