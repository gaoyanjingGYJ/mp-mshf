import { reqIndexData } from '../../api/index'

Page({
  data: {
    bannerList: [], // 轮播图数据
    categoryList: [], // 分类数据
    activeList: [], // 活动广告
    guessList: [], // 猜你喜欢
    hotList: [], // 人气推荐
    loading: true // 骨架屏
  },

  // 获取首页数据
  getIndexData: function () {
    reqIndexData().then((res) => {
      this.setData({
        bannerList: res[0].data,
        categoryList: res[1].data,
        activeList: res[2].data,
        guessList: res[3].data,
        hotList: res[4].data,
        loading: false
      })
    })
  },

  onLoad: function (options) {
    this.getIndexData()
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
  onShareTimeline() {  
  }
})
