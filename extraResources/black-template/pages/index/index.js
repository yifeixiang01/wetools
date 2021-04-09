// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad() {
    this.setData({weappNameZh: app.globalData.weappNameZh})
  }
})
