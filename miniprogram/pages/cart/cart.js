// pages/cart/component/cart.js
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/stores/userStore'
import { reqCartList, reqUpdateChecked, reqAllChecked, reqAddCart, reqDelCart } from '@/api/cart'
// 引入 behavior
const computedBehavior = require('miniprogram-computed').behavior

// 引入防抖
import { debounce } from 'miniprogram-licia'
import { modal, toast } from '@/utils/extendApi'

// 引入删除滑块自动关闭的behavior
import { swipeCellBehavior } from '@/behaviors/swipeCellBehavior'
ComponentWithStore({
  behaviors: [computedBehavior, swipeCellBehavior],

  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  // 组件的属性列表
  properties: {},

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  computed: {
    // 根据购物车中商品的选中状态控制全选与全不选按钮
    allChecked(data) {
      return data.cartList.length && data.cartList.every((item) => item.isChecked === 1)
    },

    // 计算商品总价，基于商品列表的价格和数量以及是否选中
    totalPrice(data) {
      let totalPrice = 0
      data.cartList.forEach((item) => {
        if (item.isChecked) {
          totalPrice += item.count * item.price
        }
      })

      return totalPrice
    }
  },
  // 组件的方法列表
  methods: {
    // 获取购物车列表
    async getCartList() {
      const { token } = this.data

      // 1.如果没有进行登录，购物车页面需要展示文案：`您尚未登录，点击登录获取更多权益`
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })
        return
      }
      const res = await reqCartList()
      if (res.code === 200) {
        // 2. 如果用户登录，购物车列表为空，展示文案： '还没有添加商品，快去添加吧～'
        this.setData({
          cartList: res.data,
          emptyDes: res.data.length ? '' : '还没有添加商品，快去添加吧～'
          // emptyDes: res.data.length === 0 && '还没有添加商品，快去添加吧～'
        })
      }
      // if (res.code === 200) {
      //   if (!res.data.length) {
      //     this.setData({
      //       emptyDes: '还没有添加商品，快去添加吧～'
      //     })
      //   } else {
      //     this.setData({
      //       cartList: res.data,
      //       emptyDes: ''
      //     })
      //   }
      // }

      // 登录了，但是购物车没有商品，展示文案："还没有添加商品，快去添加吧～"

      //1. 如果没有进行登录，购物车页面需要展示文案：`您尚未登录，点击登录获取更多权益`

      // 2. 如果用户进行登录，获取购物车列表数据

      //    - 购物车没有商品，展示文案： `还没有添加商品，快去添加吧～`

      //    - 购物车列表有数据，需要使用数据对页面进行渲染
    },

    // 更新购物车商品的选中状态
    async updateChecked(event) {
      const { goodsid: goodsId, index } = event.currentTarget.dataset
      const isChecked = event.detail ? 1 : 0
      const { code } = await reqUpdateChecked(goodsId, isChecked)

      // 如果数据更新成功，需要将本地的数据一同改变
      // 方法一：重新发送请求获取购物车列表
      // this.getCartList()

      // 第二种方式：更新 data 中的数据，点击了第几个数据的状态，就让第几个对应的商品本地的数据状态也进行变更
      if (code === 200) {
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },

    // 实现全选和全不选
    async changeAllStatus(event) {
      const isChecked = event.detail ? 1 : 0
      const res = await reqAllChecked(isChecked)
      // 如果请求成功，需要将本地数据一同改变
      if (res.code === 200) {
        // 方法一：重新请求购物列表数据
        // this.getCartList()

        // 方法二：更改本地数据
        // 对购物车列表数据进行深拷贝
        const newCart = JSON.parse(JSON.stringify(this.data.cartList))
        // 将数据进行更改
        newCart.forEach((item) => (item.isChecked = isChecked))

        // 对 cartList 进行赋值，驱动试图更新
        this.setData({
          cartList: newCart
        })

        // // // 用最新的全选/全不选 去设置 cartList 中的每一个选中状态
        // const { cartList } = this.data
        // cartList.forEach((item) => {
        //   item.isChecked = isChecked
        // })
        // this.setData({
        //   cartList
        // })
      }
    },

    // 更新商品的购买数量 + 防抖
    changeBuyNum: debounce(async function (event) {
      // 获取最新的购买数量，
      // 如果用户输入的值大于 200，购买数量需要重置为 200
      // 如果不大于 200，直接返回用户输入的值

      const newBuyNum = event.detail > 200 ? 200 : event.detail

      // 获取商品id,索引和之前的购买数量
      const { goodsid: goodsId, index, oldbuynum } = event.currentTarget.dataset

      // 验证用户输入的值，是否是 1 ~ 200 之间的正整数
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/

      // 对用户输入的值进行验证
      const regRes = reg.test(newBuyNum)

      // 如果验证没有通过，说明用户输入的购买数量不合法或者小于 1 ，需要重置为之前的购买数量
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })
        return
      }

      // 如果通过，需要计算差值，然后将差值发送给服务器，让服务器进行逻辑处理
      const disCount = newBuyNum - oldbuynum

      // 如果购买数量没有发生变化，不发送请求
      if (disCount === 0) return

      // 如果购买数量发生了改变，发送请求：商品 id和购买数量差值
      reqAddCart({ goodsId, count: disCount }).then((res) => {
        // 服务器更新购买数量成功以后，更新本地的数据
        if (res.code === 200) {
          this.setData({
            [`cartList[${index}].count`]: newBuyNum,
            // 如果购买数量发生了变化，需要让当前商品变成选中的状态
            [`cartList[${index}].isChecked`]: 1
          })
        }
      })
    }, 500),

    //  删除购物车商品
    async delCatrt(event) {
      const { id: goodsId } = event.currentTarget.dataset
      const modalRes = await modal({
        content: '您确定要删除此商品吗？'
      })
      if (modalRes) {
        await reqDelCart(goodsId)
        this.getCartList()
      }
    },

    // 订单结算按钮
    toOrder() {
      // 先判断是否有选择商品，如果没有给用户提示
      if (!this.data.totalPrice) {
        toast({ title: '请选择需要购买的商品！' })
        return
      }

      // 跳转到订单结算页面
      wx.navigateTo({
        url: '/modules/orderModule/pages/order/detail/detail'
      })
    },

    onShow() {
      this.getCartList()
    },
    onHide() {
      this.onSwipeCellCommonClick()
    }
  }
})
