import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginApi, getUserInfoApi, getUserDetailByIdApi } from '@/api/user'
import { Message } from 'element-ui'
import { resetRouter } from '@/router'
// 用户store管理
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state, token) {
      state.token = token
      removeToken(token)
    },
    setUserInfo(state, info) {
      state.userInfo = { ...info }
    },
    // 删除用户信息
    reomveUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async loginFn(context, loginFormData) {
      await loginApi(loginFormData)
        .then(data => {
          context.commit('setToken', data)
        })
        .catch(() => {
          Message.error('登陆失败')
        })
    },
    async loadUserInfo(context) {
      const baseInfo = await getUserInfoApi()
      const detailInfo = await getUserDetailByIdApi(baseInfo.userId)
      context.commit('setUserInfo', { ...baseInfo, ...detailInfo })
      return baseInfo
    },
    async logout(context) {
      context.commit('removeToken')
      context.commit('reomveUserInfo')
      // 重置路由
      resetRouter()
      // 清空permission模块下的state数据
      // 默认情况下 子模块的context是子模块的
      // 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
      context.commit('permission/setRoutes', [], { root: true }) // 父模块 调用 子模块的action
    }
  }
}
