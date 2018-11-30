// pages/orderdetails/orderdetails.js
const app = getApp();
const base = app.globalData.base;
const U = require('../../utils/util.js');
Page({
  data: {
    list: [],
    listLen: 0
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现记录'
    });
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    this.getOrder();
  },

  getOrder() {
    var that = this, data = {};
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Withdraw/index',
      data: data,
      success(res) {
        console.log(res);
        var list = res.data.data;
        list.map((v, i) => {
          list[i].add_time_trans = U.ftime(v.add_time);
          list[i].settle_time_trans = U.ftime(v.settle_time);
        });
        that.setData({
          list: list,
          listLen: list.length
        });
        if (that.onPullDown) {
          that.onPullDown = false;
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  onPullDownRefresh() {
    this.onPullDown = true;
    this.getOrder();
  }
})