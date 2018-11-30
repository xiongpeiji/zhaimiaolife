// pages/orderdetails/orderdetails.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    list: [],
    listLen: 0,
    account_balance: 0
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现记录'
    });
    var token = wx.getStorageSync('token');
    var userInfo = wx.getStorageSync('userInfo');
    var bank_account = wx.getStorageSync('bank_account');
    if (token) {
      this.token = token;
    }
    if (userInfo.account_balance) {
      this.setData({
        account_balance: userInfo.account_balance
      })
    }
    if (userInfo.bank_account) {
      this.bank_account = userInfo.bank_account;
    }
    if (userInfo.mobile) {
      this.mobile = userInfo.mobile;
    }
  },

  withdrawals() {
    var that = this, data = {}, account_balance = this.data.account_balance;
    if (this.data.account_balance < 2000) {
      wx.showModal({
        title: '提现失败',
        content: '暂未达到最低提现金额，满2000元起提',
        showCancel: false
      })
      return;
    }
    if (!this.mobile) {
      wx.showModal({
        title: '设置绑定手机账户',
        content: '您还没有设置绑定手机帐号，请先绑定手机帐号!',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            // 跳转到设置提现帐号的页面
            wx.navigateTo({
              url: '../setmobile/setmobile'
            })
          }
        }
      })
      return;
    }
    if (!this.bank_account) {
      wx.showModal({
        title: '设置提现账号',
        content: '您还没有设置提现帐号，请先设置提现帐号!',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            // 跳转到设置提现帐号的页面
            wx.navigateTo({
              url: '../setaccount/setaccount'
            })
          }
        }
      })
      return;
    }
    if (this.token) {
      data.token = this.token
    }
    wx.request({
      url: base + '/Withdraw/add',
      data: data,
      success(res) {
        var code = res.data.code;
        wx.showModal({
          title: '提现失败',
          content: res.data.msg,
          showCancel: false
        })
      }
    })
  }
})