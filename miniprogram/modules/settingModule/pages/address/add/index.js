import { toast } from '../../../../../utils/extendApi'
import QQMapWX from '../../../libs/qqmap-wx-jssdk'
// import Schema from 'async-validator'

import Schema from 'async-validator'
import { reqAddAddres, reqAddressDetail, reqUpdateAddress } from '../../../api/address'
Page({
  // 页面的初始数据
  data: {
    name: '', // 收货人
    phone: '', // 手机号码
    provinceName: '', // 省
    provinceCode: '', // 省编码
    cityName: '', // 市
    cityCode: '', // 市编码
    districtName: '', // 区
    districtCode: '', // 区编码
    address: '', // 详细地址
    fullAddress: '', // 完整地址  （省、市、区+详细地址）
    isDefault: false // 是否设置默认地址 0否 1是
  },

  // 保存收货地址/更新收货地址
  async saveAddrssForm(event) {
    // 点击保存按钮将表单数据通过请求发送给后台
    // 需要组织两个参数：完整地址=省+市+区+详细地址  设置默认地址 false0 true1
    const { provinceName, cityName, districtName, address, isDefault } = this.data
    const fullAddress = provinceName + cityName + districtName + address
    this.setData({
      fullAddress,
      isDefault: isDefault ? 1 : 0
    })
    // 合并最终需要发送的请求参数
    const params = {
      ...this.data,
      fullAddress,
      isDefault: isDefault ? 1 : 0
    }

    const { valid } = await this.validateAddress(params)
    if (valid) {
      // 表单校验通过，发送新增地址的请求
      const addRes = this.addressId ? await reqUpdateAddress(params) : await reqAddAddres(params)

      if (addRes.code === 200) {
        wx.navigateBack({
          success: () => {
            toast({ title: this.addressId ? '编辑收货地址成功' : '新增收货地址成功' })
          }
        })
      }
    }
  },

  // 省市区选择 获取省市区及其编码
  onAddressChange(event) {
    // 获取省市区及其编码
    const [provinceName, cityName, districtName] = event.detail.value
    const [provinceCode, cityCode, districtCode] = event.detail.code
    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode
    })
  },

  // 定位服务
  async getLocation() {
    try {
      // 获取经度、纬度、地址名
      const { latitude, longitude, name } = await wx.chooseLocation()

      console.log(111, latitude, longitude, name)

      // 进行逆地址解析
      this.qqmapsdk.reverseGeocoder({
        location: {
          latitude,
          longitude
        },
        success: (res) => {
          // 获取省、市、区、行政区划代码（后续还需要处理）
          const { province, city, district, adcode } = res.result.ad_info
          // 获取道路、门牌（道路、门牌可能为空）
          const { street, street_number } = res.result.address_component
          // 获取完整地址
          const { standard_address } = res.result.formatted_addresses

          this.setData({
            // 省、市、区编码需要对adcode进行处理

            provinceName: province, // 省
            // 省级: 前两位有值，后4位置0，如，河北省: 130000
            provinceCode: adcode.substring(0, 2) + '0000', // 省编码
            cityName: city, // 市
            cityCode: adcode.substring(0, 4) + '00', // 市编码
            districtName: district, // 区
            districtCode: district && adcode, // 区编码
            //详细地址以及完整地址，在以后开发中根据产品的需求来进行选择处理即可
            // 详细地址 街道+门牌+地址名
            address: street + street_number + name, // 详细地址
            // 完整地址  标准地址+地址名
            fullAddress: standard_address + name // 完整地址  （省、市、区+详细地址）
          })
        }
      })
    } catch (error) {
      toast({
        title: '您已拒绝授权获取地理位置信息！'
      })
    }
  },

  // 验证新增收货地址请求参数
  // 形参 params 是需要验证的数据
  validateAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    // 定义校验规则
    const rules = {
      name: [
        { required: true, message: '请输入收货人姓名' },
        { pattern: nameRegExp, message: '收货人姓名不合法' }
      ],
      phone: [
        { required: true, message: '请输入收货人手机号' },
        { pattern: phoneReg, message: '收货人手机号不合法' }
      ],
      provinceName: { required: true, message: '请选择收货人所在地区' },
      address: { required: true, message: '请输入详细地址' }
    }
    // 创建验证实例，并传入验证规则
    const validator = new Schema(rules)
    // 调用实例方法对数据进行验证
    // 注意：我们希望将验证结果通过 Promsie 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          toast({
            title: errors[0].message
          })
          // 如果属性值是 false，说明验证失败
          resolve({ valid: false })
        } else {
          // 如果属性值是 true，说明验证成功
          resolve({ valid: true })
        }
      })
    })
  },

  // 回显收货地址的逻辑
  async showAddressInfo(id) {
    if (id) {
      // 如果存在 id，将 id 挂载到 this 页面实例上，方便在多个方法中使用 id
      this.addressId = id
      // 动态设置当前页面的标题
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
      const { data } = await reqAddressDetail(id)
      // console.log(data)
      this.setData(data)
    }
  },

  // 实例化API核心类
  onLoad(options) {
    this.qqmapsdk = new QQMapWX({
      key: 'LAPBZ-3H46J-6OKFP-DOTQS-4NCQT-HXFNU'
    })

    // 接收页面传过来的参数 id
    this.showAddressInfo(options.id)
  }
})
