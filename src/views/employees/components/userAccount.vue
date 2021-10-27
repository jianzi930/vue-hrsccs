<template>
  <div>
    <el-form ref="userInfoForm" :model="userInfo" :rules="formRules" class="userForm" label-width="120px">
      <el-form-item prop="username" label="姓名:">
        <el-input v-model="userInfo.username" />
      </el-form-item>
      <el-form-item prop="password" label="密码:">
        <el-input v-model="userInfo.password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="savePersonal">更新</el-button>
        <el-button type="text" size="small" @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailApi, updatePersonalApi } from '@/api/employee'

export default {
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password: ''
      },
      formRules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  beforeDestroy() {
    // 如果想切换选项卡之后数据重置，可以在子组件中调用接口获取和更新数据
    // 这里重置表单数据，会重置为空，并且不会更新到父组件
    // this.$refs.userInfoForm.resetFields()
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    async getUserDetail() {
      this.userInfo = await getUserDetailApi(this.userId)
    },
    async savePersonal() {
      await updatePersonalApi({ ...this.formData, id: this.userId })
        .then(() => { this.$message.success('保存成功') })
        .catch(() => { this.$message('获取失败，稍后重试') })
    }
  }
}

</script>
<style>
.userForm {
  width: 400px;
  margin: 30px auto;
}
</style>
