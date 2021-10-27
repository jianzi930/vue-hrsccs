<template>
  <el-dialog :title="title" :visible="dialogShow" :show-close="false">
    <el-form ref="roleForm" :model="form" :rules="roleRules">
      <el-form-item prop="name" label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="description" label="角色描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" type="textarea" rows="3" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogShow', false)">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="roleConfrim">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRoleApi, updateRoleApi } from '@/api/roles'
export default {
  name: 'RoleDialog',
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
      roleRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '角色名称要求1-10个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 100, message: '角色描述要求1-100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击确定按钮保存新增或修改
    roleConfrim() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          this.loading = true
          this.title.includes('新增') ? await this.addRole() : await this.updateRole() // 调用接口
          this.$emit('addAndEidtRole') // 通知父组件
          this.loading = false
        } else {
          return false
        }
      })
    },
    // 保存新增
    async addRole() {
      await addRoleApi(this.form)
        .then(() => { this.$message.success('保存成功') })
        .catch(() => { this.$message.error('保存失败') })
    },
    // 保存修改
    async updateRole() {
      await updateRoleApi(this.form)
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
