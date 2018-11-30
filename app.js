//app.js

App({
  onLaunch: function () {
    // 登录
    
    // this.init();
  },
  init() {
    var that = this;
    wx.request({
      url: this.globalData.base + '/Public/appLoadInit',
      data: {
        source: "mini_program"
      },
      success(res) {
        var data = res.data.data;
        that.globalData.initData = data;
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  globalData: {
    userInfo: null,
    base: "https://api.biuzhushou.cn",
    initData: {}
  }
})