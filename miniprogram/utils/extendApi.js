const toast = ({ title = '数据加载中', icon = 'none', mask = true, drucation = 2000 } = {}) => {
    wx.showToast({
        title,
        icon,
        mask,
        drucation
    })
}

const modal = (options = {}) => {
    return new Promise((resolve) => {
        const defaultOpt = {
            title: '提示',
            content: '您确定要执行此操作吗？',
            confirmColor: '#f3514f'
        }
        const opt = { ...defaultOpt, ...options }
        wx.showModal({
            ...opt,
            complete({ confirm, cancel }) {
                confirm && resolve(true)
                cancel && resolve(false)
            }
        })
    })
}
export { toast, modal }
