// pages/goods/detail/index.js
// import { reqGoodsDetail } from '../../../../../api/goods'
import { reqGoodsDetail } from '../../../api/goods'
import { reqAddCart, reqCartList } from '@/api/cart'
import { userBehavior } from '../../../behaviors/userBehavior'
import { toast } from '@/utils/extendApi'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    buyNow: '', // 0 加入购物车，1 立即购买

    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    allCount: '' // 购物车中商品总数
  },

  // 获取商品详情数据
  async getGoodsDetail() {
    const { data } = await reqGoodsDetail(this.goodsId)

    this.setData({
      goodsInfo: data
    })
  },

  // 点击图片进行全屏预览图片
  previewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    // console.log('弹窗关闭')
    this.setData({ show: false })
  },

  // 点击确定按钮，如果是加入购物车，将其加入购物车
  // 如果是立即购买，跳转到结算页面
  async submit() {
    const { count, blessing, buyNow, token } = this.data
    const goodsId = this.goodsId
    // 如果没有登陆，让用户重新登陆
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    if (!buyNow) {
      // 加入购物车
      console.log('blessing', blessing)
      const { code } = await reqAddCart({ goodsId, count, blessing })
      if (code) {
        toast({ title: '加入购物车成功' })
        this.setData({
          show: false
        })
        // 在加入购物车成功之后，需要重新计算购物车商品的购买数量 购物车购买数量合计
        this.getCartCount()
      }
    } else {
      // 跳转到结算页面 立即购买
      wx.navigateTo({
        url: `/modules/orderModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },

  // 计算购物车中商品的总数????????????????????????????????????????????????????????
  async getCartCount() {
    // 如果没有 token ，说明用户是第一次访问小程序，没有进行登录过
    const { token } = this.data
    if (!token) return

    // 如果存在token，说明用户进行了登录，获取购物车列表的数据
    // 然后计算得出购买的数量
    // 获取购物的商品
    const { data } = await reqCartList()
    if (data.length) {
      let allCount = 0 // 购物车总数量
      data.forEach((item) => {
        allCount += item.count
      })

      // 将购物车购买数量赋值
      // info 属性的属性值要求是字符串类型
      // 而且如果购买的数量大于99 ，页面上需要展示 99+
      this.setData({
        allCount: allCount > 99 ? '99+' : allCount + ''
      })
    }

    // 在添加购物车成功之后，应该重新再计算以下购物车的数量
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    this.setData({
      count: event.detail
    })
  },

  onLoad(options) {
    // 获取页面传参过来的商品 id，并挂载到实例上
    this.goodsId = options.goodsId ? options.goodsId : ''
    this.getGoodsDetail()
    this.getCartCount()
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
