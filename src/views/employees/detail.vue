<template>
  <div class="detail-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <UserAccount />
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <UserInfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import UserInfo from './components/userInfo'
import UserAccount from './components/userAccount'
export default {
  components: {
    UserInfo,
    UserAccount
  }
}

</script>
<style lang="scss" scoped>
.detail-container {
  margin: 15px;
}

</style>
