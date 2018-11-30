// pages/search/search.js
const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    keywords: '',
    hideHistory: true,
    hideHot: false,
    search_tips: '',
    search_keyword: [],
    goods: [],
    history: [],
    desc: 'all',
    sort_type: 0,
    level: -1,
    page: 1,
    sort_price: 'default',
    sort_income: 'idefault'
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    this.clearAll = false;
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
    this.setData({
      search_tips: app.globalData.initData.search_tips,
      search_keyword: app.globalData.initData.hot_search_keyword
    })
  },
  search(e) {
    var keywords = this.data.keywords,
      that = this,
      history = this.data.history,
      flag = true,
      data = {};
    history.map((v, i) => {
      if (v == keywords) {
        flag = false;
      }
    });
    if (flag) {
      history.push(keywords);
    }
    data.keyword = keywords;
    if (this.token) {
      data.token = this.token;
    }
    var page = this.data.page;
    if (this.clearAll) {
      page = 1;
    }
    data.page = page;
    data.sort_type = 0;
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data;
        that.setData({
          goods: data,
          hideHot: true,
          history: history,
          hideHistory: false,
          desc: 'all',
          sort_type: 0,
          sort_price: 'default'
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  changeWords(e) {
    this.setData({
      keywords: e.detail.value
    });
  },
  gotoHot(e) {
    var index = e.currentTarget.dataset.index;
    var curWord = this.data.search_keyword[index];
    this.setData({
      keywords: curWord
    });
    this.clearAll = true;
    this.search();
  },
  gotoHis(e) {
    var index = e.currentTarget.dataset.index;
    var curWord = this.data.history[index];
    this.setData({
      keywords: curWord
    })
    this.clearAll = true;
    this.search();
  },
  gotoDetail(e) {
    var goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../buy/buy?id=' + goods_id
    });
  },
  showHotSearch() {
    this.setData({
      hideHot: false
    })
  },
  clearHis() {
    this.setData({
      history: [],
      hideHistory: true
    })
  },
  descGoods(e) {
    var descType = e.currentTarget.dataset.desctype,
      keywords = this.data.keywords, that = this, data = {};
    this.setData({
      desc: descType,
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
    data.keyword = keywords;
    data.sort_type = this.data.sort_type;
    if (this.token) {
      data.token = this.token;
    }
    data.page = 1;
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data;
        that.setData({
          goods: data,
          hideHot: true
        });
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onReachBottom() {
    var page = this.data.page, data = {}, that = this;
    page += 1;
    this.setData({
      page: page
    })
    data.keyword = this.data.keywords;
    if (this.token) {
      data.token = this.token;
    }
    data.sort_type = this.data.sort_type;
    var page = this.data.page;
    data.page = page;
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data, curGoods = that.data.goods, eGoods = [];
        if (curGoods.length > 0) {
          eGoods = curGoods.concat(data)
        } else {
          eGoods = data;
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
    data.keyword = this.data.keywords;
    data.sort_type = this.data.sort_type;
    if (this.token) {
      data.token = this.token;
    }
    data.page = 1;
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var data = res.data.data;
        that.setData({
          goods: data
        });
        wx.stopPullDownRefresh()
      },
      fail(err) {
        console.log(err)
      }
    })
  }
})