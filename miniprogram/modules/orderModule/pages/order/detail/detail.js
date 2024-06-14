import { reqOrderAddress, reqOrderDetail, reqBuyNowGoods, reqSubmitOrder, reqPreBuyInfo, reqPayStatus } from '../../../api/order'
import { formatTime } from '../../../utils/formatTime'
import Schema from 'async-validator'
// import Schema from '@/miniprogram_npm/async-validator/index'

import { toast } from '@/utils/extendApi'
import { debounce } from 'miniprogram-licia'
const app = getApp()
Page({
  data: {
    orderAddress: {}, // 收获地址
    orderDetail: {}, //订单详情列表
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime()
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    // 使用 new Date 将时间戳转换成 JS 中的日期对象  年-月-日进行展示
    //format 方法接收 JS的日期对象进行转换
    // 通过 new Date(时间戳) 转换成日期对象
    // console.log(event)

    const time = formatTime(new Date(event.detail))
    // 转换后的日期是用 / 分割的，且带着具体的时间
    // 而我们不希望有时间，只希望有年月日，且用 - 连接，这是需要我们去更改小程序提供的日期格式化工具
    // 只需要把 formatTime.js 中的return 自己重写即可

    this.setData({
      show: false,
      deliveryDate: time
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index'
    })
  },

  // 获取订单地址
  async getOrderAddress() {
    // 判断全局共享的 address 中是否存在数据
    // 如果存在数据，就需要从全局共享的 address 中取到数据进行赋值
    // 如果 globalData 存在收货地址，取出收货地址

    // 如果 globalData 中不存在收货地址，获取收货地址渲染即可

    if (app.globalData.address.id) {
      this.setData({
        orderAddress: app.globalData.address
      })
      return
    }

    const res = await reqOrderAddress()
    this.setData({
      orderAddress: res.data
    })
  },

  // 获取订单详情
  async getOrderDetail() {
    // 从 data 中结构数据
    const { goodsId, blessing } = this.data

    // 判断是否存在商品 id，
    // 如果存在调用立即购买商品详情的接口
    // 不存在调用获取订单详情数据接口
    const { data: orderDetail } = goodsId ? await reqBuyNowGoods({ goodsId, blessing }) : await reqOrderDetail()
    // 判断是否存在祝福语
    // 如果需要购买多个商品，挑选第一个填写了祝福语的商品进行赋值
    const orderGoods = orderDetail.cartVoList.find((item) => item.blessing !== '')

    // console.log(orderGoods)
    this.setData({
      orderDetail,
      blessing: orderGoods ? orderGoods.blessing : ''
      //  blessing：!orderGoods?'':orderGoods.blessing
    })

    // // const { data: orderDetail } = await reqOrderDetail()
    // // console.log(orderDetail)

    // // 判断是否存在祝福语
    // // 如果需要购买多个商品，挑选第一个填写了祝福语的商品进行赋值
    // const order = orderDetail.cartVoList.find((item) => item.blessing !== '')
    // // console.log(order, 12)
    // this.setData({
    //   orderDetail,
    //   blessing: order.goodsId ? order.blessing : ''
    // })
  },

  // 提交订单
  submitOrder: debounce(async function () {
    const { orderAddress, orderDetail, buyName, buyPhone, deliveryDate, blessing } = this.data
    // 组织请求参数
    const reqParams = {
      buyName,
      buyPhone,
      deliveryDate,
      blessing,
      userAddressId: orderAddress.id,
      cartList: orderDetail.cartVoList
    }
    // 对请求参数进行验证
    const { valid } = await this.validatorAddress(reqParams)

    if (!valid) return
    // 发送请求
    const { code, data } = await reqSubmitOrder(reqParams)
    if (code === 200) {
      // 在平台订单创建成功以后，将订单编号挂载到页面实例上
      this.orderNo = data
      // 获取预付单信息、支付参数
      this.advancePay()
    }
  }, 500),

  // 对新增收货地址请求参数进行验证
  validatorAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    // 创建验证规则
    const rules = {
      userAddressId: [{ required: true, message: '请选择收货地址' }],
      buyName: [
        { required: true, message: '请输入收货人姓名' },
        { pattern: nameRegExp, message: '收货人姓名不合法' }
      ],
      buyPhone: [
        { required: true, message: '请输入收货人手机号' },
        { pattern: phoneReg, message: '收货人手机号不合法' }
      ],
      deliveryDate: { required: true, message: '请选择送达时间' }
    }

    // 传入验证规则进行实例化
    const validator = new Schema(rules)

    // 调用实例方法对请求参数进行验证
    // 注意：我们希望将验证结果通过 Promise 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          toast({ title: errors[0].message })
          // 如果属性值是 false，说明验证失败
          resolve({ valid: false })
        } else {
          // 如果属性值是 true，说明验证成功
          resolve({ valid: true })
        }
      })
    })
  },

  // 获取预支付信息
  async advancePay() {
    try {
      const res = await reqPreBuyInfo(this.orderNo)
      console.log(res)
      // res.data 就是获取的支付参数
      // 调用 wx.requestPayment 方法发起微信支付
      if (res.code === 200) {
        const payInfo = await wx.requestPayment(res.data)
        // 获取支付结果
        if (payInfo.errMsg === 'requestPayment:ok') {
          // 支付成功之后查询订单的支付状态
          const payStatus = await reqPayStatus(this.orderNo)

          if (payStatus.code === 200) {
            wx.redirectTo({
              url: '/modules/orderPayModule/pages/order/list/list',
              success: () => {
                wx.toast({
                  title: '支付成功',
                  icon: 'success'
                })
              }
            })
          }
        }
      }
    } catch (error) {
      toast({ title: '支付失败', icon: 'error' })
    }
  },
  onShow() {
    this.getOrderAddress()
    this.getOrderDetail()
  },
  onLoad(options) {
    // 获取累计购买商品传递的参数
    // 然后把参数赋值给 data 中的状态，如果有相同属性名的就把值覆盖，如果没有则添加新的属性
    this.setData({
      ...options
    })
  },

  // 订单支付页面销毁了，需要把全局共享的 address 清空，下次再次进入结算支付页面时需要重新请求获取默认的收获地址进行渲染
  // 这里需要和产品多沟通
  onUnload() {
    // 在赋值以后需要将收货地址清空
    app.globalData.address = {}
  }
})
