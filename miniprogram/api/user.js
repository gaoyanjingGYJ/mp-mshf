import http from '../utils/http'

/**
 * @description 授权登录
 * @param {*} code 临时登录凭证code
 * @returns Promise
 */
export const reqLogin = (code) => {
    return http.get(`/weixin/wxLogin/${code}`)
}

/**
 * @description 获取用户信息
 * @returns Promise
 */
export const reqUserInfo = () => {
    return http.get('/weixin/getuserInfo')
}

/**
 * @description 上传文件到服务器
 * @param {*} filePath 要上传的文件路径
 * @param {*} name 文件对应的 key
 * @return Promise
 */
export const reqUploadFile = (filePath, name) => {
    return http.upload('/fileUpload', filePath, name)
}

/**
 * @description 更新用户个人信息
 * @param {*} userInfo 用户个人信息
 * @return Promise
 */
export const reqUpdateUserInfo = (userInfo) => {
    return http.post('/weixin/updateUser', userInfo)
}
