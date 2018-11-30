// pages/promoters/promoters.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad() {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      if (userInfo.invite_code) {
        this.invite_code = userInfo.invite_code;
      } else {
        this.invite_code = 'zhuantuitui';
      }
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '还在傻傻拼团？点击看看，更优惠。自购更省钱，推广还能赚钱!',
      path: 'pages/index/index?invite_code=' + this.invite_code,
      imageUrl: 'https://pic.taodianke.com/static/MiniProgram/share.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})