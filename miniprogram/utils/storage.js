/**
 * @description 存储本地数据
 * @param {*} key 本地缓存中执行的 key
 * @param {*} data 需要缓存的数据
 */
export const setStorage = (key, data) => {
    try {
        wx.setStorageSync(key, data)
    } catch (error) {
        console.log(`存储 ${key} 数据时发生了异常`, error)
    }
}

/**
 * @description 读取本地数据
 * @param {*} key
 */
export const getStorage = (key) => {
    try {
        const value = wx.getStorageSync(key)
        return value
    } catch (error) {
        console.log(`读取 ${key} 数据时发生了异常`, error)
    }
}

/**
 * @description 删除本地数据
 * @param {*} key
 */
export const removeStorage = (key) => {
    try {
        wx.removeStorageSync(key)
    } catch (error) {
        console.log(`删除 ${key} 数据时发生了异常`, error)
    }
}

/**
 * @description 清除本地数据
 */
export const clearStorage = () => {
    try {
        wx.clearStorageSync()
    } catch (error) {
        console.log('清除本地数据时发生了异常', error)
    }
}

/**
 *  @description 异步存储本地数据
 * @param { Stirng} key 本地缓存中执行的 key
 * @param {*} data 本地缓存的数据
 */
export const asyncSetStorage = (key, data) => {
    return new Promise((resolve) => {
        wx.setStorage({
            key,
            data,
            complete(res) {
                resolve(res)
            }
        })
    })
}

/**
 * @description 异步读取本地数据
 * @param {String} key 本地存储取值的 key
 */
export const asyncGetStorage = (key) => {
    return new Promise((resolve) => {
        wx.getStorage({
            key,
            complete(res) {
                resolve(res)
            }
        })
    })
}

/**
 * @description 异步删除本地存储数据
 * @param {Stirng} key 本地存储删除数据的 key
 */
export const asyncRemoveStorage = (key) => {
    return new Promise((resolve) => {
        wx.removeStorage({
            key,
            complete(res) {
                resolve(res)
            }
        })
    })
}

/**
 * @description 异步清除本地存储的数据
 */
export const asyncClearStorage = () => {
    return new Promise((resolve) => {
        wx.clearStorage({
            complete(res) {
                resolve(res)
            }
        })
    })
}
