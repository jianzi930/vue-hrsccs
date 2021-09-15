import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 注册全局 icon 组件
Vue.component('svg-icon', SvgIcon)

// 引入所有以.svg结尾的文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
