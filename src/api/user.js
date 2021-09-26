import request from '@/utils/request'

/**
 *  用户登录
**/
export function loginApi(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 *  获取用户的基本资料
**/
export function getUserInfoApi() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * 获取用户的基本信息,头像等
**/
export function getUserDetailByIdApi(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
