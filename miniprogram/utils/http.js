// import { modal, toast } from './extendApi'
// import { clearStorage } from './storage'
// import WxRequest from './request'
// const instance = new WxRequest({
//     baseURL: 'https://gmall-prod.atguigu.cn/mall-api',
//     timeout: 150000,
//     isLoading: false
//     // timeout: 100
// })

// // 配置请求拦截器
// instance.interceptors.request = (config) => {
//     //在请求前做一些添加、修改请求参数的操作
//     const token = wx.getStorageSync('token')
//     if (token) {
//         config.header['token'] = token
//     }

//     return config
// }
// //配置响应拦截器
// instance.interceptors.response = async (response) => {
//     const { isSuccess, data } = response
//     if (!isSuccess) {
//         // wx.showToast({
//         //     title: '网络异常，请稍后重试',
//         //     icon: 'error'
//         // })
//         toast({
//             title: '网络异常，请稍后重试',
//             showCancel: false
//         })
//         return Promise.reject(response)
//     }
//     switch (data.code) {
//         case 200:
//             return data
//         case 208:
//             const res = await modal({
//                 content: '登录授权过期，请重新登录',
//                 showCancel: false // 不显示取消按钮
//             })
//             if (res) {
//                 clearStorage() // 清除之前失效的token，同时要清除本地存储的全部信息
//                 wx.navigateTo({
//                     url: '/pages/login/login'
//                 })
//             }
//             return Promise.reject(response)
//         default:
//             toast({
//                 title: '程序出现异常，请联系客服或稍后重试'
//             })
//             return Promise.reject(response)
//     }

//     // 对服务器返回的响应数据做一些逻辑操作
// }
// export default instance

import WxRequest from 'mina-request'
import { getStorage, clearStorage } from './storage'
import { modal, toast } from './extendApi'
import { env } from './env'

const http = new WxRequest({
  baseURL: env.baseURL,
  timeout: 15000,
  isLoading: false
})

// 配置请求拦截器
http.interceptors.request = (config) => {
  const token = getStorage('token')
  if (token) {
    config.header['token'] = token
  }
  return config
}

// 配置响应拦截器
http.interceptors.response = async (response) => {
  const { isSuccess, data } = response
  if (!isSuccess) {
    toast({
      title: '网络错误请重试',
      icon: 'error'
    })
    // return Promise.reject(response)
    return response
  }

  // 判断状态码
  switch (data.code) {
    case 200:
      return data
    case 208:
      const res = await modal({
        content: '鉴权失败，请重新登录',
        showCancel: false
      })
      if (res) {
        clearStorage()
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
      return Promise.reject(response)

    default:
      toast({
        title: '程序错误，请联系客服或稍后重试'
      })
      return Promise.reject(response)
  }
}

export default http

// import WxRequest from './request'
// import { getStorage, clearStorage } from './storage'
// import { modal, toast } from './extendApi'
// // import { env } from './env'

// // 对 WxRequest 进行实例化
// const instance = new WxRequest({
//   baseURL: 'https://gmall-prod.atguigu.cn/mall-api',
// //   baseURL: env.baseURL,
//   timeout: 15000,
//   isLoading: false
// })

// // 配置请求拦截器
// instance.interceptors.request = (config) => {
//   // 在请求发送之前做点什么……

//   // 在发送请求之前，需要先判断本地是否存在访问令牌 token
//   const token = getStorage('token')

//   // 如果存在 token，就需要在请求头中添加 token 字段
//   if (token) {
//     config.header['token'] = token
//   }

//   return config
// }

// // 配置响应拦截器
// // instance.interceptors.response = async (response) => {
// //   // 从 response 中解构 isSuccess
// //   const { isSuccess, data } = response

// //   // 如果 isSuccess 为 false，说明执行了 fail 回调函数
// //   // 这时候就说明网络异常，需要给用户提示网络异常
// //   if (!isSuccess) {
// //     wx.showToast({
// //       title: '网络异常请重试',
// //       icon: 'error'
// //     })

// //     return response
// //   }

// //   // 判断服务器响应的业务状态码
// //   switch (data.code) {
// //     // 如果后端返回的业务状态码等于 200，说请求成功，服务器成功响应了数据
// //     case 200:
// //       // 对服务器响应数据做点什么……
// //       return data

// //     // 如果返回的业务状态码等于 208，说明 没有 token，或者 token 失效
// //     // 就需要让用户登录或者重新登录
// //     case 208:
// //       const res = await modal({
// //         content: '鉴权失败，请重新登录',
// //         showCancel: false // 不显示取消按钮
// //       })

// //       if (res) {
// //         // 清除之前失效的 token ，同时要清除本地存储的全部信息
// //         clearStorage()

// //         wx.navigateTo({
// //           url: '/pages/login/login'
// //         })
// //       }

// //       return Promise.reject(response)

// //     default:
// //       toast({
// //         title: '程序出现异常，请联系客服或稍后重试'
// //       })

// //       return Promise.reject(response)
// //   }
// // }

// // 将 WxRequest 实例进行暴露出去，方便在其他文件中进行使用
// export default instance
