import http from '../../../utils/http'
/**
 * @description 新增地址信息
 * @param {*} data 详细地址信息对象
 * @return Promise
 */
export const reqAddAddres = (data) => {
  return http.post('/userAddress/save', data)
}

/**
 * @description 收获地址列表
 * @return Promise
 */
export const reqAddressList = () => {
  return http.get('/userAddress/findUserAddress')
}

/**
 * @description 收货地址详情
 * @param {*} id 收获地址 id
 * @return Promise
 */
export const reqAddressDetail = (id) => {
  return http.get(`/userAddress/${id}`)
}

/**
 * @description 更新收货地址
 * @param {Object} data 新的收货地址信息对象
 * @return Promise
 */
export const reqUpdateAddress = (data) => {
  return http.post('/userAddress/update', data)
}

/**
 * @description 删除收获地址
 * @param {*} id 收获地址 id
 * @return Promise
 */
export const reqDelAddress = (id) => {
  return http.get(`/userAddress/delete/${id}`)
}
