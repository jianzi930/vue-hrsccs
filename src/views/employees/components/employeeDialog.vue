<template>
  <el-dialog title="添加员工" :visible="dialogShow" :show-close="false" top="5vh">
    <el-form ref="employeeForm" :model="form" :rules="employeeRules">
      <el-form-item prop="username" label="姓名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
        <el-input v-model="form.mobile" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="workNumber" label="工号" :label-width="formLabelWidth">
        <el-input v-model="form.workNumber" />
      </el-form-item>
      <el-form-item prop="departmentName" label="部门" :label-width="formLabelWidth">
        <el-input v-model="form.departmentName" autocomplete="off" @focus="departHandler" />
        <el-tree
          v-if="innerVisible"
          v-loading="treeLoading"
          :data="departData"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item prop="formOfEmployment" label="聘用形式" :label-width="formLabelWidth">
        <el-select v-model="form.formOfEmployment" placeholder="请选择聘用形式">
          <el-option v-for="obj in enumData.hireType" :key="obj.id" :label="obj.value" :value="obj.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="timeOfEntry" label="入职时间" :label-width="formLabelWidth">
        <el-date-picker v-model="form.timeOfEntry" type="date" placeholder="入职时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item prop="correctionTime" label="转正时间" :label-width="formLabelWidth">
        <el-date-picker v-model="form.correctionTime" type="date" placeholder="转正时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogShow', false)">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="employeeConfrim">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addEmployeeApi } from '@/api/employee'
import { getDepartmentsApi } from '@/api/department'
import enumData from '@/utils/enum'
import { tranListToTreeData } from '@/utils'
import { validMobile } from '@/utils/validate'
export default {
  name: 'EmployeeDialog',
  props: {
    dialogShow: {
      type: Boolean
    }
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '100px',
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      loading: false,
      treeLoading: false,
      enumData,
      innerVisible: false,
      departData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      employeeRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '姓名要求1-10个字符', trigger: 'blur' }
        ],
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        workNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { min: 1, max: 10, message: '工号要求1-10个字符', trigger: 'blur' }
        ],
        departmentName: [{ required: true, message: '请选择部门', trigger: 'change' }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '请选择转正时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击确定按钮保存新增或修改
    employeeConfrim() {
      this.$refs.employeeForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await this.addEmployee() // 调用接口
          this.$emit('addEmployee') // 通知父组件
          this.loading = false
        } else {
          return false
        }
      })
    },
    // 保存新增
    async addEmployee() {
      await addEmployeeApi(this.form)
        .then(() => { this.$message.success('保存成功') })
        .catch(() => { this.$message.error('保存失败') })
    },
    // 点击选择部门
    departHandler() {
      this.innerVisible = true
      this.treeLoading = true
      this.getDepartments()
    },
    // 获取所有部门
    async getDepartments() {
      const resule = await getDepartmentsApi()
      this.departData = tranListToTreeData(resule.depts, '')
      this.treeLoading = false
    },
    // 确定选择部门
    handleNodeClick(rows) {
      this.form.departmentName = rows.name
      this.innerVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input,
.el-select {
  width: 100%;
  position: relative;
}
.el-tree {
  position: absolute;
  width: 100%;
  height: 200px;
  z-index: 999;
  border: 1px solid #dddee1;
  left: 0;
  border-radius: 5px;
  overflow: auto;
}
</style>
