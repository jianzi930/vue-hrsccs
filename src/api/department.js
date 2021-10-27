import request from '@/utils/request'

/**
 * 获取组织架构数据
**/
export function getDepartmentsApi() {
  return request({
    url: '/company/department'
  })
}
/**
 *  新增部门接口
**/
export function addDepartmentsApi(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
/**
 *  修改部门接口
**/
export function updateDepartmentsApi(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *  删除部门接口
**/
export function deleteDepartmentsApi(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
