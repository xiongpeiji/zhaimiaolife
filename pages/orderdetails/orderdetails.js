// pages/orderdetails/orderdetails.js
const app = getApp();
const U = require('../../utils/util.js');
const base = app.globalData.base;
Page({
  data: {
    start_day: '',
    end_day: '',
    detail: {},
    listLen: 0,
    hideShift: true,
    state: 'all',
    sorce: 'all',
    order_status: -1,
    source: 'all'
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单明细'
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

  shiftAction() {
    var hideShift = this.data.hideShift;
    this.setData({
      hideShift: !hideShift
    })
  },

  getOrder() {
    var that = this, data = {};
    data.start_day = this.data.start_day;
    data.end_day = this.data.end_day;
    if (this.token) {
      data.token = this.token;
    }
    if (this.data.source) {
      data.source = this.data.source;
    }
    if (this.data.order_status || this.data.order_status == 0) {
      data.order_status = this.data.order_status;
    }
    wx.request({
      url: base + '/Order/index',
      data: data,
      success(res) {
        console.log(res)
        var detail = res.data.data;
        var list = detail.list;
        list.map((v, i) => {
          var state = "";
          switch (v.order_status) {
            case '0':
              state = "已支付";
              break;
            case '1':
              state = "已成团";
              break;
            case '2':
              state = "确认收货";
              break;
            case '3':
              state = "审核成功";
              break;
            case '4':
              state = "审核失败(不可提现）";
              break;
            case '5':
              state = "已提现";
              break;
          }
          list[i].state = state;
          list[i].add_time_trans = U.ftime(v.add_time);
        });
        detail.list = list;
        that.setData({
          detail: detail,
          listLen: detail.list.length
        });
        if (that.onPulldown) {
          that.onPulldown = false;
          wx.stopPullDownRefresh();
        }
      }
    })
  },

  startChange(e) {
    var val = e.detail.value;
    this.setData({
      start_day: val
    })
    this.getOrder();
  },

  endChange(e) {
    var val = e.detail.value;
    this.setData({
      end_day: val
    })
    this.getOrder();
  },

  changeState(e) {
    var ltype = e.target.dataset.type;
    switch (ltype) {
      case 'all':
        this.setData({
          state: ltype
        })
        this.order_status = -1;
        break;
      case 'pay':
        this.setData({
          state: ltype
        })
        this.order_status = 0;
        break;
      case 'end':
        this.setData({
          state: ltype
        })
        this.order_status = 1;
        break;
    }
    console.log(this.order_status);
  },

  changeSorce(e) {
    var ltype = e.target.dataset.type;
    switch (ltype) {
      case 'all':
        this.setData({
          sorce: ltype
        });
        this.source = 'all';
        break;
      case 'self':
        this.setData({
          sorce: ltype
        })
        this.source = 'self';
        break;
      case 'son':
        this.setData({
          sorce: ltype
        })
        this.source = 'son';
        break;
      case 'group_leader':
        this.setData({
          sorce: ltype
        })
        this.source = 'group_leader';
        break;
      case 'partner':
        this.setData({
          sorce: ltype
        })
        this.source = 'partner';
        break;
    }
  },

  ensure() {
    this.setData({
      hideShift: true,
      source: this.source,
      order_status: this.order_status
    });
    this.getOrder();
  },

  hideShiftAct() {
    this.setData({
      hideShift: true
    })
  },

  onPullDownRefresh() {
    this.onPulldown = true;
    this.getOrder()
  }
})