// 控制页面登录权限的文件 权限拦截 导航守卫 路由守卫  router

import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
// 路由的前置守卫
router.beforeEach((to, from, next) => {
  // 是否有token
  if (store.getters.token) {
    // 如果去登录页，直接跳过登录，进入首页
    if (to.path === '/login') {
      next('/')
    } else {
      // 如果去其他页面，直接通行
      next()
    }
    // 获取用户资料
    if (!store.getters.userId) {
      store.dispatch('user/loadUserInfo')
    }
  } else {
    // 没有 token 判断是否前往白名单， 是 则同行，否 则进入登录页
    whiteList.includes(to.path) ? next() : next('/login')
  }
})
