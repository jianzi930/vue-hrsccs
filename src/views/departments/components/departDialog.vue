<template>
  <el-dialog :title="title" :visible="dialogShow" :show-close="false">
    <el-form ref="departForm" :model="form" :rules="departRules">
      <el-form-item prop="name" label="部门名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人" :label-width="formLabelWidth">
        <el-select v-model="form.manager" placeholder="请选择部门负责人" @focus="getEmployeeSimple">
          <el-option v-for="obj in employeeList" :key="obj.id" :label="obj.username" :value="obj.username" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍" :label-width="formLabelWidth">
        <el-input v-model="form.introduce" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogShow', false)">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="departConfrim">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getEmployeeSimpleApi } from '@/api/employee'
import { addDepartmentsApi, updateDepartmentsApi } from '@/api/department'
export default {
  name: 'DepartDialog',
  props: {
    dialogShow: {
      type: Boolean
    },
    form: {
      type: Object,
      require: true,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      loading: false,
      employeeList: [],
      departRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 10, message: '部门名称要求1-10个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 10, message: '部门编码要求1-10个字符', trigger: 'blur' }
        ],
        manager: [{ required: true, message: '请选择部门负责人', trigger: 'blur' }],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 100, message: '部门介绍要求1-100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击确定按钮保存新增或修改
    departConfrim() {
      this.$refs.departForm.validate(async valid => {
        if (valid) {
          this.loading = true
          this.title.includes('添加') ? await this.addDepartments() : await this.editDepartments() // 调用接口
          this.$emit('addAndEidtDepart') // 通知父组件
          this.loading = false
        } else {
          return false
        }
      })
    },
    // 获取负责人列表
    async getEmployeeSimple() {
      await getEmployeeSimpleApi()
        .then(res => {
          this.employeeList = res
        })
        .catch(() => { this.$message.error('获取失败') })
    },
    // 保存新增
    async addDepartments() {
      await addDepartmentsApi(this.form)
        .then(() => { this.$message.success('保存成功') })
        .catch(() => { this.$message.error('保存失败') })
    },
    // 保存修改
    async editDepartments() {
      await updateDepartmentsApi(this.form)
        .then(() => { this.$message.success('保存成功') })
        .catch(() => { this.$message.error('保存失败') })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
