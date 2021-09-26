// 导出属于员工的路由规则
import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 外层都是layout  组件位于layout的二级路由里面
export default {
  path: '/setting', // 路径
  name: 'setting', // 给路由规则加一个name
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
    path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
    component: () => import('@/views/setting'),
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      icon: 'setting', // 菜单前面的图标
      title: '公司设置' // meta属性的里面的属性 随意定义 这里用title是因为左侧导航title作为显示菜单名称
    }
  }]
}
