import http from '@/utils/http'

/**
 * @description 获取订单详情
 * @return Promise
 */
export const reqOrderDetail = () => {
  return http.get('/order/trade')
}

/**
 * @description 获取订单地址
 * @return Promise
 */
export const reqOrderAddress = () => {
  return http.get('/userAddress/getOrderAddress')
}

/**
 * @description 获取立即购买商品的详情信息
 * @param {Object} param0  {goodsId 商品id,blessing 祝福语}
 * @return Promise
 */
export const reqBuyNowGoods = ({ goodsId, ...data }) => {
  // return http.get(`/order/buy/${goodsId}`, blessing)
  return http.get(`/order/buy/${goodsId}`, data)
}

/**
 * @description 提交订单
 * @param {Object} data
 */
export const reqSubmitOrder = (data) => {
  return http.post('/order/submitOrder', data)
}

/**
 * @description 微信预支付信息
 * @param {string} orderNo 订单 id
 */
export const reqPreBuyInfo = (orderNo) => {
  return http.get(`/webChat/createJsapi/${orderNo}`)
}

/**
 * @description 微信支付状态查询
 * @param {string} orderNo  订单编号 id
 */
export const reqPayStatus = (orderNo) => {
  return http.get(`/webChat/queryPayStatus/${orderNo}`)
}

/**
 * @description 获取订单列表
 * @param {Object} param0 {page 页码,limit 每页请求条数}
 * @return Promise
 */
export const reqOrderList = ({ page, limit }) => {
  return http.get(`/order/order/${page}/${limit}`)
}
