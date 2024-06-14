// pages/profile/profile.js

import { userBehavior } from './behavior'
import { reqUploadFile, reqUpdateUserInfo } from '@/api/user'
import { toast } from '../../../../utils/extendApi'
import { setStorage } from '../../../../utils/storage'
Page({
  behaviors: [userBehavior],

  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },

  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true,
      // 点击了取消按钮清空了表单，在显示弹窗时，需要给 input 的 value 值 nickname 重新赋值
      'userInfo.nickname': this.data.userInfo.nickname
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false
    })
  },

  // 更新用户头像
  chooseAvatar(e) {
    // 获取头像信息的临时路径
    // 临时路径具有失效时间，需要将临时路径上传到公司的服务器，获取永久的路径
    // 在获取永久路径以后，需要使用永久路径更新 store 中的数据 / 页面数据，使用 setData / setUserInfo
    // 用户点击 保存按钮，才算真正的更新了头像和昵称，将数据传送到后台
    // 本地用户信息更新

    const { avatarUrl } = e.detail
    reqUploadFile(avatarUrl, 'file').then((res) => {
      this.setData({
        'userInfo.headimgurl': res.data
      })
      // 这里不能使用更新 store
      // 因为如果用户更新了头像但又取消了没有保存的话，只需要把当前页面的头像更新，返回后又是原来的头像即可

      // this.setUserInfo({
      //     ...this.data.userInfo,
      //     headimgurl: res.data
      // })
    })
  },

  // 保存更新后用户个人信息
  updateUserInfo() {
    // 将更新后的个人信息上传到后台，并更新 store 和本地的 userInfo 个人信息
    // console.log(this.data.userInfo)
    reqUpdateUserInfo(this.data.userInfo).then((res) => {
      if (res.code === 200) {
        this.setUserInfo(this.data.userInfo)
        setStorage('userInfo', this.data.userInfo)
        toast({
          title: '个人信息更新成功',
          icon: 'none'
        })
      }
    })
  },

  // 获取昵称
  getNickname(e) {
    const { nickname } = e.detail.value
    // 将新的 nickname 更新到 data
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
    // 在点击保存按钮时将所有数据更新到store和本地
  }
})
