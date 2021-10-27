// import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, constantRoutes } from '@/router'

// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
// 权限store管理
export default {
  namespaced: true,
  state: {
    routes: constantRoutes
  },
  mutations: {
    setRoutes(state, newRoutes) {
      // 每次更新 都在静态路由的基础上进行追加
      state.routes = [...constantRoutes, ...newRoutes]
    }
  },
  actions: {
    async filterRoutes(context, menus) {
      const routes = []
      asyncRoutes.forEach(route => {
        if (menus.includes(route.name)) routes.push(route)
      })
      context.commit('setRoutes', routes) // 将动态路由提交给mutations
      return routes
    }
  }
}
