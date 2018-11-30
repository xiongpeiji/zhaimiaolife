// pages/setaccount/setaccount.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    bank: ["中国建设银行", "交通银行", "招商银行", "中国农业银行", "中国工商银行", "中国邮政储蓄银行", "中国银行", "中国民生银行", "中信银行", "兴业银行 "],
    curBank: '',
    countdown: '',
    cding: false
  },
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    wx.setNavigationBarTitle({
      title: '设置提现账户'
    });
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo.mobile) {
      this.mobile = userInfo.mobile
    }
  },

  count() {
    var that = this, count = 60;
    this.setData({
      cding: true
    });
    this.timer = setInterval(function () {
      count--;
      that.setData({
        countdown: count + 's'
      });
    }, 1000);

    setTimeout(function () {
      clearInterval(that.timer);
      that.setData({
        cding: false,
        countdown: ''
      })
    }, 60000)
  },

  send() {
    var that = this;
    if (this.data.cding) return;
    if (!this.mobile) {
      wx.showToast({
        title: '手机号异常'
      });
      return;
    }
    wx.request({
      url: base + '/Public/sendCode',
      data: {
        mobile: this.mobile
      },
      success(res) {
        var code = res.data.code;
        if (code == 'success') {
          wx.showToast({
            title: '验证码已发送'
          });
          that.count();
        }
        if (code == 'fail') {
          wx.showModal({
            title: '手机号异常',
            content: '手机号异常请稍后再试或重新绑定？',
            showCancel: true,
            confirmText: '重新绑定',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../setmobile/setmobile',
                })
              }
            }
          })
        }
      }
    })
  },

  selectBank(e) {
    var value = e.detail.value;
    var curBank = this.data.bank[value];
    if (curBank) {
      this.setData({
        curBank: curBank
      })
    }
  },

  submit(e) {
    var value = e.detail.value, that = this;
    var bank_account = value.bank_account;
    var bank_account_real_name = value.bank_account_real_name;
    var bank_name = value.bank_name;
    var sms_code = value.sms_code;
    var sub_bank_name = value.sub_bank_name;
    var reg = /^[0-9]{4}$/;
    if (!reg.test(sms_code)) {
      wx.showToast({
        title: '验证码错误'
      });
      return;
    }
    wx.request({
      url: base + '/Withdraw/setBankAccount',
      data: {
        bank_account: bank_account,
        bank_account_real_name: bank_account_real_name,
        bank_name: bank_name,
        sms_code: sms_code,
        sub_bank_name: sub_bank_name,
        token: this.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencode'
      },
      success(res) {
        var code = res.data.code;
        if (code == 'not_login') {
          wx.showModal({
            title: '请登录',
            content: '您的登录状态已过期请重新登录',
            showCancel: true,
            success(res) {
              if (res.confirm) {
                that.userLogin();
              }
            }
          })
        }
        if (code == 'success') {
          that.getDetail();
          wx.showModal({
            title: '绑定成功',
            content: '您的提现帐号已经绑定成功！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          });
        }
      }
    })
  },

  getDetail() {
    var that = this, data = {};
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/User/detail',
      data: data,
      success(res) {
        var userInfo = res.data.data;
        that.setData({
          userInfo: userInfo
        });
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        });
      }
    })
  }
})