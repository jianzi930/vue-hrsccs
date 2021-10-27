import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      const { points } = userInfo.roles
      return points.includes(key)
    }
  }
}
