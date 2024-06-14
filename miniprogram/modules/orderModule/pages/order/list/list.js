// pages/order/list/index.js
import { reqOrderList } from '../../../api/order'
import { toast } from '@/utils/extendApi'
Page({
  // 页面的初始数据
  data: {
    orderList: [], // 订单列表
    total: 0, // 订单总条数
    isLoading: false, //是否正在请求中
    page: 1,
    limit: 10
    //请求参数
  },

  // 获取订单列表
  async getOrderList() {
    const { page, limit, orderList, isLoading } = this.data
    this.setData({
      isLoading: true
    })
    const { code, data } = await reqOrderList({ page, limit })

    if (code === 200) {
      this.setData({
        // 合并
        orderList: [...orderList, ...data.records],
        total: data.total,
        isLoading: false
      })
    }
  },

  // 上拉加载更多
  onReachBottom() {
    const { page, total, orderList, isLoading } = this.data
    if (isLoading) return
    // 判断是否加载完毕
    if (total === orderList.length) {
      return toast({ title: '数据加载完毕' })
    }
    this.setData({
      page: page + 1
    })
    this.getOrderList()
  },

  // 下拉刷新
  onPullDownRefresh() {
    // const {page,orderList,isLoading,total}=this.data
    this.setData({
      page: 1,
      orderList: [],
      total: 0
    })
    this.getOrderList()
    wx.stopPullDownRefresh()
  },
  onLoad() {
    this.getOrderList()
  }
})
