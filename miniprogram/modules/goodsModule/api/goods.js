import http from '@/utils/http'

/**
 * @description 商品列表
 * @param {Object} param0 {page,limit,category1Id,category2Id}
 * @return Promise
 */
export const reqGoodsList = ({ page, limit, ...data }) => {
  return http.get(`/goods/list/${page}/${limit}`, data)
}

/**
 * @description 获取商品详情
 * @param {*} goodsId 商品 id
 * @return  Promise
 */
export const reqGoodsDetail = (goodsId) => {
  return http.get(`/goods/${goodsId}`)
}
