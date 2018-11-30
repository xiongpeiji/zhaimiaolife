// pages/team/team.js
const app = getApp();
const base = app.globalData.base;
const U = require('../../utils/util.js');
Page({
  data: {
    invite_level: 'son',
    list: [],
    listLen: 0
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的团队'
    });
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    var userInfo = wx.getStorageSync('userInfo');
    this.invite_code = 'zhuantuitui';
    if (userInfo) {
      if (userInfo.invite_code) {
        this.invite_code = userInfo.invite_code;
      } else {
        this.invite_code = 'zhuantuitui';
      }
    }
    this.getTeam();
  },

  getTeam() {
    var that = this, data = {};
    data.invite_level = this.data.invite_level;
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/User/inviteList',
      data: data,
      success(res) {
        var list = res.data.data;
        list.map((v, i) => {
          list[i].add_time_trans = U.ftime(v.add_time);
        });
        that.setData({
          list: list,
          listLen: list.length
        })
        if (that.onPullDown) {
          that.onPullDown = false;
          wx.stopPullDownRefresh()
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  showSon() {
    this.setData({
      invite_level: 'son'
    })
    this.getTeam();
  },

  showOther() {
    this.setData({
      invite_level: 'other'
    });
    this.getTeam();
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
  },

  onPullDownRefresh() {
    this.onPullDown = true;
    this.getTeam();
  }


})