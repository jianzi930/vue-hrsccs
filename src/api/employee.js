import request from '@/utils/request'

/**
 *  获取员工的简单列表
**/
export function getEmployeeSimpleApi() {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 * 获取员工的综合列表数据
**/
export function getEmployeeListApi(params) {
  return request({
    url: '/sys/user',
    params
  })
}
/**
 * 删除员工接口
**/
export function delEmployeeApi(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
/**
 *  新增员工的接口
**/
export function addEmployeeApi(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
/**
 *  批量导入员工的接口
**/
export function importEmployeeApi(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
/**
 *  获取某个用户的基本信息
**/
export function getUserDetailApi(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
/**
 * 保存员工的基本信息
**/
export function saveUserDetailApi(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *  读取用户详情的基础信息
**/
export function getPersonalDetailApi(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonalApi(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
/** *
 * 给用户分配角色
 * ***/
export function updateAssignRolesApi(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
