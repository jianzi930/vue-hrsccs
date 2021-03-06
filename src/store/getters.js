// store数据快捷访问
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  userId: state => state.user.userInfo.userId, // 建立用户Id的映射
  avatar: state => state.user.userInfo.staffPhoto, // 用户头像
  routes: state => state.permission.routes // 导出当前的路由
}
export default getters
