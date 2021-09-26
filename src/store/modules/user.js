import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginApi, getUserInfoApi, getUserDetailByIdApi } from '@/api/user'
import { Message } from 'element-ui'

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
    },
    async logout(context) {
      context.commit('removeToken')
      context.commit('reomveUserInfo')
    }
  }
}
