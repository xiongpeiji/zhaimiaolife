// pages/setmobile/setmobile.js
const app = getApp();
const base = app.globalData.base;
const md5 = require('../../utils/md5.js');
Page({
  data: {
    mobile: 0,
    code: '',
    countdown: '',
    cding: false,
    password: ''
  },

  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '绑定手机'
    });
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
  },

  regMobile(e) {
    var mobile = e.detail.value;
    this.setData({
      mobile: mobile
    })
  },

  regCode(e) {
    var code = e.detail.value;
    this.setData({
      code: code
    })
  },

  send() {
    if (this.data.cding) return;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var mobile = this.data.mobile, that = this;
    if (myreg.test(mobile)) {
      wx.request({
        url: base + '/Public/sendCode',
        data: {
          mobile: mobile
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
            wx.showToast({
              title: '请勿重复发送'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '号码格式错误'
      })
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

  submit(e) {
    var that = this;
    var sms_code = e.detail.value.sms_code;
    var password = e.detail.value.password;
    var reg = /^[0-9]{4}$/;
    if (!reg.test(sms_code)) {
      wx.showToast({
        title: '验证码错误'
      });
      return;
    }
    if (password.length < 6 || password.length > 20) {
      wx.showToast({
        title: '密码长度为6到20'
      });
      return;
    }

    wx.request({
      url: base + '/User/setMobile',
      data: {
        mobile: this.data.mobile,
        password: md5.hex(password),
        sms_code: sms_code,
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
            content: '您的手机号码已经绑定成功！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack()
              }
              that.getDetail();
            }
          });
        }

        if (code == 'fail') {
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
  },

  userLogin() {
    var that = this;
    wx.login({
      success: res => {
        that.getAuthor(res.code);
      }
    });
  },
  getAuthor(code) {
    // 获取用户信息
    var that = this;
    console.log(code);
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo({
                success: function (res) {
                  // console.log(res);
                  that.login(res, code);
                }
              })
            },
            fail() {
              wx.showToast({
                title: '拒绝授权将无法登录'
              })
            }
          })
        } else {
          wx.getUserInfo({
            success: function (res) {
              that.login(res, code);
            }
          })
        }
      }
    })
  },
  login(res, code) {
    var that = this, data = {};
    if (this.invite_code) {
      data.invite_code = this.invite_code
    } else {
      data.invite_code = "zhuantuitui"
    }
    data.weixin_login_code = code;
    data.weixin_encrypted_data = res.encryptedData;
    data.weixin_iv = res.iv;
    wx.request({
      url: base + '/Public/login',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success(res) {
        var code = res.data.code;
        if (code != 'success') {
          wx.showToast({
            title: '登录失败-' + code
          });
          return;
        }
        var userInfo = res.data.data;
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        });
        wx.setStorage({
          key: 'token',
          data: userInfo.token
        });
        that.setData({
          isLogin: true,
          userInfo: userInfo
        })
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