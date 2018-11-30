// pages/orderdetails/orderdetails.js
const app = getApp();
const base = app.globalData.base;
const U = require('../../utils/util.js');
Page({
  data: {
    start_day: '',
    end_day: '',
    detail: {},
    listLen: 0,
    hideShift: true,
    state: 'all'
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收入流水'
    });
    var curTime = new Date();
    var sevenTime = curTime.getTime() - 24 * 3600 * 7 * 1000;
    var seven = new Date(sevenTime);
    this.setData({
      end_day: curTime.getFullYear() + "-" + (curTime.getMonth() * 1 + 1) + "-" + curTime.getDate(),
      start_day: seven.getFullYear() + "-" + (seven.getMonth() * 1 + 1) + "-" + seven.getDate()
    });
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    this.getOrder();
  },

  getOrder() {
    var that = this, data = {};
    data.start_day = this.data.start_day;
    data.end_day = this.data.end_day;
    if (this.token) {
      data.token = this.token;
    }
    if (this.data.state) {
      data.source = this.data.state;
    }
    wx.request({
      url: base + '/CashFlow/index',
      data: data,
      success(res) {
        var detail = res.data.data;
        var list = detail.list;
        list.map((v, i) => {
          list[i].add_time_trans = U.ftime(v.add_time);
        });
        detail.list = list;
        that.setData({
          detail: detail,
          listLen: detail.list.length
        });
        if (that.onPullDown) {
          that.onPullDown = false;
          wx.stopPullDownRefresh()
        }
      }
    })
  },

  startChange(e) {
    var val = e.detail.value;
    this.setData({
      start_day: val
    })
  },

  endChange(e) {
    var val = e.detail.value;
    this.setData({
      end_day: val
    })
  },

  shiftAction() {
    var hideShift = this.data.hideShift;
    this.setData({
      hideShift: !hideShift
    })
  },

  changeState(e) {
    var ltype = e.target.dataset.type;
    switch (ltype) {
      case 'all':
        this.setData({
          state: ltype
        })
        break;
      case 'self':
        this.setData({
          state: ltype
        })
        break;
      case 'son':
        this.setData({
          state: ltype
        })
        break;
      case 'group_leader':
        this.setData({
          state: ltype
        })
        break;
      case 'award':
        this.setData({
          state: ltype
        })
        break;
      case 'red_packet':
        this.setData({
          state: ltype
        })
        break;
      case 'withdraw':
        this.setData({
          state: ltype
        })
        break;
      case 'partner':
        this.setData({
          state: ltype
        })
        break;
    }
  },

  ensure() {
    this.setData({
      hideShift: true
    });
    this.getOrder();
  },

  hideShiftAct() {
    this.setData({
      hideShift: true
    })
  },

  onPullDownRefresh() {
    this.onPullDown = true;
    this.getOrder();
  }
})