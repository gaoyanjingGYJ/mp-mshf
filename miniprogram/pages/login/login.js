import { reqLogin, reqUserInfo } from '../../api/user'
import { setStorage } from '../../utils/storage'
import { toast } from '../../utils/extendApi'

import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../stores/userStore'

// 引入防抖函数
import { debounce } from 'miniprogram-licia'
ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },

  methods: {
    login: debounce(function () {
      wx.login({
        success: ({ code }) => {
          if (code) {
            // 调用接口 API，传入 code 进行登录
            reqLogin(code).then((res) => {
              const { token } = res.data
              // 登陆成功以后将token存储到本地
              setStorage('token', token)

              // 将token存储到store
              this.setToken(token)

              // 获取用户信息，并将用户信息存储到 store
              this.getUserInfo()

              // 返回上一个页面
              wx.navigateBack()
            })
          } else {
            // 登录失败，给用户提示
            toast({
              title: '授权失败，请稍后重试'
            })
          }
        }
      })
    }, 500),

    // 获取用户信息,并将用户信息存储到本地和 store 中
    getUserInfo() {
      reqUserInfo().then((res) => {
        // 用户信息存储到本地
        setStorage('userInfo', res.data)
        // 用户信息存储到store
        this.setUserInfo(res.data)
      })
    }
  }
})
