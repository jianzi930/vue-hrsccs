// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import ConfirmDialog from './ConfirmDialog'
import UploadFile from './UploadFile'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('ConfirmDialog', ConfirmDialog)
    Vue.component('UploadFile', UploadFile) // 注册导入excel组件
  }
}
