class WxRequest {
    defaults = {
        baseURL: '',
        url: '',
        data: null,
        method: 'GET',
        header: {
            'Content-type': 'application/json'
        },
        timeout: 60000,
        isLoading: true //是否显示 loading
    }

    interceptors = {
        request: (config) => {
            return config
        },
        response: (response) => {
            return response
        }
    }

    queue = []

    constructor(params = {}) {
        this.defaults = { ...this.defaults, ...params }
    }

    request = (option) => {
        // 有请求进来会把上一次的定时器清除，上一次的定时器就不会执行了，只会执行最后一次的定时器
        this.timerId && clearTimeout(this.timerId)
        option.url = this.defaults.baseURL + option.url
        option = { ...this.defaults, ...option }

        if (option.isLoading) {
            this.queue.length === 0 &&
                wx.showLoading({
                    title: '数据加载中...'
                })
            this.queue.push('request')
        }

        // 在请求前调用请求拦截器
        option = this.interceptors.request(option)

        return new Promise((resolve, reject) => {
            if (option.method === 'UPLOAD') {
                wx.uploadFile({
                    ...option,
                    success: (res) => {
                        res.data = JSON.parse(res.data)
                        const mergeRes = Object.assign({}, res, {
                            config: option,
                            isSuccess: true
                        })
                        resolve(this.interceptors.response(mergeRes))
                    },
                    fail: (err) => {
                        const mergeErr = Object.assign({}, err, {
                            config: option,
                            isSuccess: false
                        })
                        reject(this.interceptors.response(mergeErr))
                    }
                   
                })
            } else {
                wx.request({
                    ...option,
                    success: (res) => {
                        // 不管调用成功与否都需要调用响应拦截器
                        const mergeRes = Object.assign({}, res, { config: option, isSuccess: true })
                        resolve(this.interceptors.response(mergeRes))
                    },
                    fail: (err) => {
                        const mergeErr = { ...err, config: option, isSuccess: false }
                        reject(this.interceptors.response(mergeErr))
                    },
                    complete: () => {
                        if (option.isLoading && option.method!="UPLOAD") {
                            this.queue.pop()
                            this.queue.length === 0 && this.queue.push('request')
                            this.timerId = setTimeout(() => {
                                this.queue.pop()
                                this.queue.length === 0 && wx.hideLoading()
                                clearTimeout(this.timerId)
                            }, 1)
                        }
                    }
                })
            }
        })
    }

    get = (url, data = {}, config = {}) => {
        return this.request({ url, data, method: 'GET', ...config })
    }
    post = (url, data = {}, config = {}) => {
        return this.request({ url, data, method: 'POST', ...config })
    }
    put = (url, data = {}, config = {}) => {
        return this.request({ url, data, method: 'PUT', ...config })
    }
    delete = (url, data = {}, config = {}) => {
        return this.request({ url, data, method: 'DELETE', ...config })
    }

    all = (...promise) => {
        return Promise.all(promise)
    }

    uploadFile = (url, filePath, name, config = {}) => {
        return this.request(Object.assign({ url, filePath, name, method: 'UPLOAD' }, config))
    }
}

export default WxRequest
//-----------------------------------------------------
