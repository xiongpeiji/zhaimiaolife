const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    imgUrls: [
      '../../images/01.jpg',
      '../../images/02.jpg',
      '../../images/03.jpg',
      '../../images/04.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    level: -1,
    indicatorColor: '#e0e0e0',
    indicatorActiveColor: '#ff1849',
    goods: [],
    page: 1,
    menuArr: [
      {
        "name": "美食",
        "id": "1",
        "img_src": "../../images/lis-1.png"
      },
      {
        "name": "母婴",
        "id": "4",
        "img_src": "../../images/lis-4.png"
      },
      {
        "name": "水果",
        "id": "13",
        "img_src": "../../images/lis-13.png"
      },
      {
        "name": "服饰",
        "id": "14",
        "img_src": "../../images/lis-14.png"
      },
      {
        "name": "百货",
        "id": "15",
        "img_src": "../../images/lis-15.png"
      },
      {
        "name": "美妆",
        "id": "16",
        "img_src": "../../images/lis-16.png"
      },
      {
        "name": "电器",
        "id": "18",
        "img_src": "../../images/lis-18.png"
      },
      {
        "name": "男装",
        "id": "743",
        "img_src": "../../images/lis-743.png"
      },
      {
        "name": "家纺",
        "id": "818",
        "img_src": "../../images/lis-818.png"
      },
      {
        "name": "鞋包",
        "id": "128",
        "img_src": "../../images/lis-128.png"
      },
      {
        "name": "运动",
        "id": "1451",
        "img_src": "../../images/lis-1451.png"
      },
      {
        "name": "手机",
        "id": "1543",
        "img_src": "../../images/lis-1543.png"
      }
    ]
  },
  onLoad: function (options) {
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
    this.invite_code = options.invite_code;
    if (!this.invite_code) {
      if (userInfo.invite_code) {
        this.invite_code = userInfo.invite_code
      } else {
        this.invite_code = 'zhuantuitui';
      }
    }
    wx.setStorage({
      key: 'invite_code',
      data: this.invite_code
    })
    this.init();
    this.getGoods();
  },

  init() {
    var that = this;
    wx.request({
      url: base + '/Public/appLoadInit',
      data: {
        source: "mini_program"
      },
      success(res) {
        var data = res.data.data;
        app.globalData.initData = data;
        if (data.advert_data) {
          that.setData({
            imgUrls: data.advert_data
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  gotoSearch() {
    wx.switchTab({
      url: '../search/search'
    })
  },
  gotoMenu(e) {
    var index = e.currentTarget.dataset.index;
    var curItem = this.data.menuArr[index];
    if (curItem) {
      var id = curItem.id;
      var name = curItem.name;
      wx.navigateTo({
        url: '../menu/menu?category_id=' + id + '&name=' + name
      })
    }
  },
  getGoods() {
    var that = this;
    var data = {};
    if (this.token) {
      data.token = this.token;
    }
    var page = this.data.page;
    data.page = page;
    wx.request({
      url: base + '/Goods/search',
      data: data,
      success(res) {
        var goods = res.data.data, eGoods = [];
        var curGoods = that.data.goods;
        if (curGoods.length > 0) {
          eGoods = curGoods.concat(goods);
        } else {
          eGoods = goods;
        }
        that.setData({
          goods: eGoods
        });
        if (that.onpdrefresh) {
          that.onpdrefresh = false;
          wx.stopPullDownRefresh();
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  showDetail(e) {
    var id = e.currentTarget.dataset.id;
    // if login and user level
    wx.navigateTo({
      url: '../buy/buy?id=' + id
    });
    // if logout
    // wx.navigateTo({
    //   url: '../commision/commision'
    // });
  },

  onShareAppMessage: function (res) {
    return {
      title: '还在傻傻拼团？点击看看，更优惠。自购更省钱，推广还能赚钱!',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onPullDownRefresh() {
    this.onpdrefresh = true;
    this.init();
    this.getGoods();
  },

  onReachBottom() {
    var page = this.data.page;
    page += 1;
    this.setData({
      page: page
    })
    this.getGoods();
  }
})