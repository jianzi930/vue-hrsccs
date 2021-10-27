<template>
  <div class="app-container em-con">
    <div>
      <PageTools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="warning" @click.native="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click.native="exportHandler">导出</el-button>
          <el-button size="small" type="primary" @click.native="employeeDdialogShow = true">新增员工</el-button>
        </template>
      </PageTools>
      <el-table :data="employeeData" style="width: 100%" :border="true" fit>
        <el-table-column type="index" label="序号" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="workNumber" label="工号" sortable />
        <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" />
        <el-table-column prop="departmentName" label="部门" />
        <el-table-column prop="timeOfEntry" label="入职时间">
          <span slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</span>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" :formatter="formatEnable" />
        <el-table-column label="操作" width="280" fixed="right">
          <div slot-scope="{ row }">
            <el-button type="text" size="small" @click.native="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="showRoleDialog(row.id)">角色</el-button>
            <el-button type="text" size="small" :disabled="!checkPermission('point-user-delet')" @click="showConfirmHandler(row.id)">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="page.page"
        :page-sizes="[2, 5, 10]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, ->"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增员工窗口 -->
    <EmployeeDialog
      v-if="employeeDdialogShow"
      :dialog-show.sync="employeeDdialogShow"
      @addEmployee="addEmployeeHandler"
    />
    <!-- 删除确认窗口 -->
    <ConfirmDialog
      text="确定删除该员工吗？"
      :dialog-show.sync="confirmDialogShow"
      @dialogConfrim="deleteDepartments"
    />
    <!-- 分配角色窗口 -->
    <RoleAssign
      v-if="roleDialogShow"
      :role-dialog-show.sync="roleDialogShow"
      :user-id="currentConfirmId"
    />
  </div>
</template>

<script>
import EmployeeDialog from './components/employeeDialog'
import RoleAssign from './components/roleAssign.vue'
import { getEmployeeListApi, delEmployeeApi } from '@/api/employee'
import enumData from '@/utils/enum'
import { headerRelations } from '@/utils/excel-header'
import { formatDate } from '@/utils/filters'
export default {
  components: {
    EmployeeDialog,
    RoleAssign
  },
  data() {
    return {
      employeeData: [],
      employeeDdialogShow: false,
      confirmDialogShow: false,
      currentConfirmId: '',
      currentRoleId: '',
      roleDialogShow: false,
      page: {
        page: 1, // 当前第几页
        size: 5, // 每页显示的条数
        total: 10 // 一共多少数据
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取所有员工
    async getEmployeeList() {
      await getEmployeeListApi(this.page)
        .then(res => {
          this.employeeData = res.rows
          this.page.total = res.total
        })
        .catch(() => { this.$message('获取失败') })
    },
    // 确定添加员工
    addEmployeeHandler() {
      this.employeeDdialogShow = false
      this.getEmployeeList()
    },
    // 点击删除员工
    showConfirmHandler(id) {
      this.confirmDialogShow = true // 删除提示框显示
      this.currentConfirmId = id
    },
    // 确定删除员工
    async deleteDepartments() {
      this.confirmDialogShow = false // 删除提示框隐藏
      await delEmployeeApi(this.currentConfirmId)
        .then(() => {
          this.$message.success('删除成功')
          this.getEmployeeList()
        })
        .catch(() => { this.$message.error('删除失败') })
    },
    // 导出
    exportHandler() {
      const data = this.formatJson(headerRelations, this.employeeData)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headerRelations), // 表头 必填
          data, // 具体数据 必填
          filename: '员工信息表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 点击角色显示弹窗
    showRoleDialog(id) {
      this.roleDialogShow = true
      this.currentRoleId = id
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      // 首先遍历数组
      // [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = enumData.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
      })
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // row:这一行所有的数据, column：这一列表格相关的信息, cellValue：这个单元格的内容, index：单元格所在行数
      const cellObj = enumData.hireType.find(obj => obj.id === cellValue)
      return cellObj ? cellObj.value : '未知'
    },
    // 格式化账户状态
    formatEnable(row, column, cellValue, index) {
      // row:这一行所有的数据, column：这一列表格相关的信息, cellValue：这个单元格的内容, index：单元格所在行数
      const cellObj = enumData.enableState.find(obj => obj.id === cellValue)
      return cellObj ? cellObj.value : '未知'
    },
    // 切换每页条数
    handleSizeChange(val) {
      this.page.size = val
      this.getEmployeeList()
    },
    // 切换当前页
    handleCurrentChange(val) {
      this.page.page = val
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.em-con {
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        padding: 30px 20px 0;
      }
    }
  }
}
</style>
