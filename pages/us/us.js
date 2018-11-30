// pages/my/my.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    isLogin: false,
    userInfo: {},
    avatar: '',
    invite_tips: ''
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的',
    });
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userInfo = res.data;
        console.log(userInfo == null)
        that.setData({
          userInfo: userInfo,
        });
        console.log(userInfo);
      }
    });
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
      this.setData({
        isLogin: true
      })
    }
    this.invite_code = 'zhuantuitui';
    var invite_code = wx.getStorageSync('invite_code');
    if (invite_code) {
      this.invite_code = invite_code;
    } else {
      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        if (userInfo.invite_code) {
          this.invite_code = userInfo.invite_code;
        }
      }
    }
    // this.getDetail();
  },

  onShow() {
    var initData = app.globalData.initData;
    if (initData) {
      var invite_tips = initData.invite_tips;
      if (invite_tips) {
        this.setData({
          invite_tips: invite_tips
        })
      }
    }
    this.getDetail();
  },
  getDetail() {
    var that = this, data = {};
    if (this.token) {
      data.token = this.token;
    } else {
      return;
    }
    var time = new Date();
    var tnow = time.getTime();
    var preTime = wx.getStorageSync('getDetail');
    if (preTime > tnow) return;
    wx.request({
      url: base + '/User/detail',
      data: data,
      success(res) {
        var userInfo = res.data.data;
        var code = res.data.code;
        if (code == 'not_login') {

          return;
        }
        that.setData({
          userInfo: userInfo,
          invite_tips: userInfo.invite_tips
        });
        wx.setStorage({
          key: 'userInfo',
          data: userInfo
        });
        wx.setStorage({
          key: 'getDetail',
          data: tnow + 600000
        })
      }
    })
  },
  gotoIncome() {
    wx.navigateTo({
      url: '../income/income',
    })
  },
  gotoTeam() {
    wx.navigateTo({
      url: '../team/team',
    })
  },
  gotoAbout() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  gotopromoters() {
    wx.navigateTo({
      url: '../promoters/promoters'
    })
  },
  userLogin() {
    var that = this;
    wx.showLoading({
      title: '正在登录',
    })
    wx.login({
      success: res => {
        that.getAuthor(res.code);
      }
    });
  },
  getAuthor(code) {
    // 获取用户信息
    var that = this;
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
    data.invite_code = this.invite_code
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
        that.invite_code = userInfo.invite_code;
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
          userInfo: userInfo,
          invite_tips: userInfo.invite_tips
        });
        console.log(userInfo);
        wx.hideLoading();
      }
    })
  },
  onShareAppMessage: function (res) {
    console.log('invite_code: ' + this.invite_code);
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