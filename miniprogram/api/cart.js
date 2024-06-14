import http from '@/utils/http'

/**
 * @description 适用于 [商品详情加入购物车] 以及 [购物车更新商品数量]
 * @param {Object} param0 { goodsId 商品 id,count 购买数量,blessing 祝福语 }
 * @return Promise
 */
export const reqAddCart = ({ goodsId, count, blessing }) => {
  return http.get(`/cart/addToCart/${goodsId}/${count}`, blessing)
}

/**
 * @description 购物车列表
 * @return Promise
 */
export const reqCartList = () => {
  return http.get('/cart/getCartList')
}

/**
 * @description 更新商品的选中状态
 * @param {*} goodsId 商品 id
 * @param {*} isChecked 更新后的状态，0 不勾选，1 勾选
 * @return Promise
 */
export const reqUpdateChecked = (goodsId, isChecked) => {
  return http.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}

/**
 * @description 全选与全不选
 * @param {*} isChecked 0 取消全选，1 全选
 * @return Promise
 */
export const reqAllChecked = (isChecked) => {
  return http.get(`/cart/checkAllCart/${isChecked}`)
}

/**
 * @description 删除购物车商品
 * @param {*} goodsId 商品 id
 * @return Promise
 */
export const reqDelCart = (goodsId) => {
  return http.get(`/cart/delete/${goodsId}`)
}
