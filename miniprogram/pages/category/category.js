import { reqCategoryData } from '../../api/category'
Page({
  data: {
    categoryList: [], // 分类数据列表
    activeIndex: 0
  },

  getCategoryData() {
    reqCategoryData().then((res) => {
      this.setData({
        categoryList: res.data
      })
    })
  },
  setCateIndex(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  onLoad: function () {
    this.getCategoryData()
  },
  
})
