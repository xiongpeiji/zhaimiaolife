const app = getApp();
const base = app.globalData.base;

Page({
  data: {
    income: {},
    hideRule: true,
    account_balance: 0,
    userInfo: {}
  },

  onLoad(options) {
    var token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync('userInfo');
    if (token) {
      this.token = token;
    }
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
      console.log(userInfo);
    }
    this.getBalance();
  },

  getBalance() {
    var that = this,
      data = {};
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Balance/index',
      data: data,
      success(res) {
        var income = res.data.data;
        that.setData({
          income: income
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  orderDetail() {
    wx.navigateTo({
      url: '../orderdetails/orderdetails'
    })
  },

  commision() {
    wx.navigateTo({
      url: '../commision/commision'
    })
  },

  withdrawals() {
    wx.navigateTo({
      url: '../withdrawals/withdrawals'
    })
  },

  diaryaccount() {
    wx.navigateTo({
      url: '../diaryaccount/diaryaccount'
    })
  },

  presentrecord() {
    wx.navigateTo({
      url: '../presentrecord/presentrecord'
    })
  },

  showRule() {
    this.setData({
      hideRule: false
    })
  },

  iKnow() {
    this.setData({
      hideRule: true
    })
  }
})