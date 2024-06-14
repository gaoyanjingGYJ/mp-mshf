// pages/goods/list/index.js
import { reqGoodsList } from '../../../api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕

    params: {
      page: 1, //页码
      limit: 10, // 每页展示条数
      category1Id: '', // 一级分类 id
      category2Id: '' // 二级分类 id
    }, // 请求参数
    total: 0, // 数据总条数
    isLoading: false // 是否正在发送请求
  },

  // 获取商品列表
  async getGoodsList() {
    this.setData({
      isLoading: true
    })
    const { data } = await reqGoodsList(this.data.params)
    this.setData({
      // 请求数据获取之后和原来的商品列表合并
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total,
      isLoading: false
    })
  },

  // 上拉加载更多 到底部之后 如果商品列表的条数小于total ,page+1,发送请求
  onReachBottom() {
    const { params, total, goodsList, isLoading } = this.data
    let { page } = params

    // 判断是否加载完毕，如果 isLoading 等于 true
    // 说明数据还没有加载完毕，不加载下一页数据
    if (isLoading) return

    // 判断数据是否全部加载完毕
    // 开始让 goodsList 长度和 total 进行对比
    // 如果数据相等，商品列表已经加载完毕，如果数据已经加载完毕，给用户提示 并且 后续的操作就不在执行了
    if (goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      return
    }

    this.setData({
      params: { ...params, page: page + 1 }
    })
    this.getGoodsList()
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 把 data 中的数据还原
    this.setData({
      goodsList: [],
      isFinish: false,
      total: 0,
      params: {
        ...this.data.params,
        page: 1
      }
    })

    // 重新发送请求
    this.getGoodsList()

    // 手动关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  onLoad(event) {
    //  获取 一级分类/二级分类 id
    this.setData({
      params: { ...this.data.params, ...event }
    })
    this.getGoodsList()
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index', //path 需要和产品经理进行协商
      imageUrl: '../../assets/images/love.jpg'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {}
})
