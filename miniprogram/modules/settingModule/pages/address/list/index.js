// pages/address/list/index.js
import { reqAddressList, reqDelAddress } from '../../../api/address'
import { modal, toast } from '../../../../../utils/extendApi'
import { swipeCellBehavior } from '../../../../../behaviors/swipeCellBehavior'
const app = getApp()
Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: []
  },

  // 去编辑页面 需要传递参数 id 在新增地址页面通过判断是否有id来判断是新增地址还是编辑地址
  toEdit(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },

  //获取收货地址列表
  async getAddressList() {
    const { data } = await reqAddressList()

    this.setData({
      addressList: data
    })
  },

  // 删除收获地址
  async delAddress(event) {
    // console.log(event)
    const { id } = event.currentTarget.dataset

    const modalRes = await modal({
      content: '您确定要删除该收货地址吗？'
    })
    if (modalRes) {
      const res = await reqDelAddress(id)
      if (res.code === 200) {
        toast({ title: '收货地址删除成功' })
        this.getAddressList()
      }
    }
  },

  // 切换收货地址
  changeAddress(event) {
    // 判断是否是从订单结算页面进入
    // 如果是，才能获取点击的收获地址，否则，不执行后续的逻辑，不执行切换地址的逻辑
    if (this.flag !== '1') return
    const { id } = event.currentTarget.dataset
    // 从收货地址列表中获取到获取到点击的收货地址详细信息
    const address = this.data.addressList.find((item) => item.id === id)

    // 如果获取成功，将数据存储到 globalData 中
    if (address) {
      app.globalData.address = address
      wx.navigateBack()
    }
  },

  onShow() {
    this.getAddressList()
  },
  onLoad(options) {
    // 接收传递的参数，挂载到页面的实例上，方便在其他方法中使用
    this.flag = options.flag
  }
})
