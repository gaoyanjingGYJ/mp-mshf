export const swipeCellBehavior = Behavior({
  data: {
    swipeCellQueue: [] // 实例存储队列
  },
  methods: {
    // 获取滑动单元格实例
    onSwipeCellOpen(e) {
      const { id } = e.currentTarget
      const instance = this.selectComponent(`#${id}`)
      // 将实例追加到数组中
      this.data.swipeCellQueue.push(instance)
    },
    // 点击页面空白区域时，关掉开启的滑块
    onSwipeCellPageTap() {
      this.onSwipeCellCommonClick()
    },
    // 点击其他滑块时，关掉开启的滑块
    onSwipeCellClick() {
      this.onSwipeCellCommonClick()
    },
    // 关掉滑块的统一方法
    onSwipeCellCommonClick() {
      // 需要对单元格实例数组进行遍历，遍历以后获取每一个实例，让每一个实例调用 close  方法即可

      // 循环关闭开启的滑块
      this.data.swipeCellQueue.forEach((instance) => {
        instance.close()
      })
      // 将滑块进行清空
      this.data.swipeCellQueue = []
    }
  }
})
