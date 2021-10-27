<template>
  <div class="user-detail">
    <!-- 个人信息 -->
    <el-form ref="userForm" :model="userInfo" label-width="120px" class="user-info">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item prop="workNumber" label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="timeOfEntry" label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              class="inputW"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item prop="username" label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="departmentName" label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item prop="mobile" label="手机">
            <el-input v-model="userInfo.mobile" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="formOfEmployment" label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in enumData.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item prop="staffPhoto" label="员工头像">
            <ImageUpload
              ref="staffPhoto"
              @uploadImage="userInfo.staffPhoto = $event"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>

        </el-col>
      </el-row>
    </el-form>
    <!-- 基础信息 -->
    <el-form ref="baseForm" :model="formData" label-width="220px" class="base-info">
      <div class="block">
        <div class="title">基础信息</div>
        <el-form-item prop="theHighestDegreeOfEducation" label="最高学历">
          <el-select v-model="formData.theHighestDegreeOfEducation" class="inputW2">
            <el-option
              v-for="item in enumData.highestDegree"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="nationalArea" label="国家/地区">
          <el-select v-model="formData.nationalArea" class="inputW2">
            <el-option
              v-for="item in enumData.isOverseas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="idNumber" label="身份证号">
          <el-input v-model="formData.idNumber" placeholder="正规身份证格式" class="inputW" />
        </el-form-item>
        <el-form-item prop="nativePlace" label="籍贯">
          <el-input v-model="formData.nativePlace" placeholder="籍贯地址" class="inputW5" />
        </el-form-item>
        <el-form-item prop="maritalStatus" label="婚姻状况">
          <el-select v-model="formData.maritalStatus" class="inputW2">
            <el-option
              v-for="item in enumData.maritaStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="doChildrenHaveCommercialInsurance" label="有无商业险">
          <el-radio-group v-model="formData.doChildrenHaveCommercialInsurance">
            <el-radio label="1">有</el-radio>
            <el-radio label="2">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row class="inline-info" type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" @click="savePersonal">保存</el-button>
            <el-button @click="$router.back()">返回</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import ImageUpload from './imageUpload'
import enumData from '@/utils/enum'
import { getUserDetailApi, getPersonalDetailApi, updatePersonalApi, saveUserDetailApi } from '@/api/employee'
export default {
  components: {
    ImageUpload
  },
  data() {
    return {
      userId: this.$route.params.id,
      enumData,
      userInfo: {
        workNumber: '',
        timeOfEntry: ''
      },
      formData: {
        userId: this.$route.params.id,
        username: '', // 用户名
        mobile: '', // 手机
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        theHighestDegreeOfEducation: '', // 最高学历
        nationalArea: '', // 国家
        idNumber: '', // 身份证号
        nativePlace: '', // 籍贯
        maritalStatus: '', // 婚姻状况
        staffPhoto: '', // 员工照片
        birthday: '', // 生日
        doChildrenHaveCommercialInsurance: '' // 有无商业保险
      }
    }
  },
  created() {
    this.getUserDetail()
    this.getPersonalDetail()
  },
  mounted() {
    if (this.userInfo.staffPhoto && this.$refs.staffPhoto) {
      this.$refs.staffPhoto.fileList = [{ url: this.userInfo.staffPhoto }]
    }
  },
  methods: {
    // 获取员工账户信息
    async getUserDetail() {
      this.userInfo = await getUserDetailApi(this.userId)
    },
    // 获取员工个人信息
    async getPersonalDetail() {
      await getPersonalDetailApi(this.userId)
        .then(res => {
          this.formData = res
        })
        .catch(() => { this.$message('获取失败，稍后重试') })
    },
    // 保存员工基础信息
    async savePersonal() {
      await updatePersonalApi(this.formData)
        .then(() => { this.$message.success('保存成功') })
        .catch(() => { this.$message('获取失败，稍后重试') })
    },
    // 保存员工个人信息
    async saveUser() {
      //  调用父组件
      await saveUserDetailApi(this.userInfo)
        .then(() => {
          this.$store.dispatch('user/loadUserInfo')
          this.$message.success('保存成功')
        })
        .catch(() => { this.$message('获取失败，稍后重试') })
    }
    // 保存员工基础信息
  }
}

</script>
<style lang="scss" scoped>
.user-info {
  margin: 30px auto;
  .el-input {
    width: 300px;
  }
}
.title {
  padding: 10px 0;
  font-weight: 400;
  font-size: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e1e1e1;
}
</style>
