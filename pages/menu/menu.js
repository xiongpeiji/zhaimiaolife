// pages/search/search.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    goods: [],
    desc: 'all',
    sort_type: 0,
    sort_price: 'default',
    sort_income: 'idefault',
    page: 1,
    level: -1
  },
  onLoad(options) {
    this.category_id = options.category_id;
    var name = options.name;
    wx.setNavigationBarTitle({
      title: name
    });
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.userInfo = userInfo;
      var level = userInfo.level;
      if (level) {
        this.setData({
          level: userInfo.level
        })
      }
    }
    this.getGoods();
  },
  getGoods() {
    var that = this, data = {};
    data.category_id = this.category_id;
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data;
        that.setData({
          goods: data
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  descGoods(e) {
    var descType = e.currentTarget.dataset.desctype,
      keywords = this.data.keywords, that = this, data = {};
    this.setData({
      desc: descType,
      page: 1,
      sort_price: 'default',
      sort_income: 'idefault'
    });
    switch (descType) {
      case 'all':
        this.setData({
          sort_type: 0
        });
        break;
      case 'count':
        this.setData({
          sort_type: 6
        });
        break;
      case 'price':
        if (this.data.sort_type == 3) {
          this.setData({
            sort_type: 4,
            sort_price: 'down'
          });
        } else {
          this.setData({
            sort_type: 3,
            sort_price: 'up'
          });
        }
        break;
      case 'income':
        if (this.data.sort_type == 1) {
          this.setData({
            sort_type: 2,
            sort_income: 'idown'
          });
        } else {
          this.setData({
            sort_type: 1,
            sort_income: 'iup'
          });
        }
        break;
    }
    data.category_id = this.category_id;
    data.sort_type = this.data.sort_type;
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data;
        that.setData({
          goods: data
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  gotoDetail(e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../buy/buy?id=' + goods_id
    });
  },

  onReachBottom() {
    var page = this.data.page, data = {}, that = this;
    this.setData({
      page: page += 1
    });
    data.category_id = this.category_id;
    data.sort_type = this.data.sort_type;
    data.page = this.data.page;
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var goods = res.data.data, curGoods = that.data.goods, eGoods = [];
        if (curGoods.length > 0) {
          eGoods = curGoods.concat(goods);
        } else {
          eGoods = goods;
        }
        that.setData({
          goods: eGoods
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  onPullDownRefresh() {
    var data = {}, that = this;
    data.category_id = this.category_id;
    data.sort_type = this.data.sort_type;
    data.page = 1;
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data;
        that.setData({
          goods: data
        });
        wx.stopPullDownRefresh();
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})