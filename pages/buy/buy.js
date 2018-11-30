const app = getApp();
const base = app.globalData.base;
Page({
  data: {
    current: 1,
    goods: {},
    swiper_all: 0,
    level: -1
  },

  onLoad(options) {
    this.id = options.id;
    this.token = options.token;
    var token = wx.getStorageSync('token');
    if (token) {
      this.token = token;
    }
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.level = userInfo.level;
      this.setData({
        level: userInfo.level
      })
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
    this.getDetail();
  },
  backHome() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  getDetail() {
    var that = this, data = {};
    data.goods_id = this.id;
    if (this.token) {
      data.token = this.token;
    }
    wx.request({
      url: base + '/Goods/detail',
      data: data,
      success(res) {
        var goods = res.data.data;
        that.setData({
          goods: goods
        });
        var goods_gallery_urls = goods.goods_gallery_urls;
        if (goods_gallery_urls) {
          that.setData({
            swiper_all: goods_gallery_urls.length
          })
        }
      }
    })
  },
  swiper(e) {
    var current = e.detail.current;
    this.setData({
      current: current + 1
    })
  },

  openTo() {
    var goods = this.data.goods;
    wx.navigateToMiniProgram({
      appId: 'wx32540bd863b27570',
      path: goods.pdd_mini_program_path,
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },

  buy() {
    // 您的优惠购买链接已复制到剪贴板里，请打开微信发送给任意一位好友，然后点击里面的链接即可下单
    // 我知道了，现在去发给好友
    // 【抢XX元无门槛优惠券】我XX元拼了+商品名称+，推荐给你。点击购买 + 购买短链接
    // 我XX元拼了+商品名称+，推荐给你。点击购买  + 购买短链接
    var goods = this.data.goods;
    wx.setClipboardData({
      data: '【抢' + goods.coupon_discount + '元无门槛优惠券】我' + goods.after_coupon_price + '元拼了' + goods.goods_name + '，推荐给你。点击购买' + goods.short_url,
      success: function (res) {
        console.log(res);
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            wx.showModal({
              title: '【抢' + goods.coupon_discount + '元无门槛优惠券】',
              content: '您的优惠购买链接已复制到剪贴板里，请打开微信发送给任意一位好友，然后点击里面的链接即可下单。',
              showCancel: false,
              confirmText: '我知道了',
              success: function (res) {
                if (res.confirm) {
                  setTimeout(function () {
                    wx.showToast({
                      title: '去分享给好友吧'
                    })
                  }, 500)
                }
              }
            });
          }
        })
      }
    });
  },

  onShareAppMessage: function (res) {
    var goods = this.data.goods;
    return {
      title: '【抢' + goods.coupon_discount + '元无门槛优惠券】我' + goods.after_coupon_price + '元拼了' + goods.goods_name + '，推荐给你。点击购买' + goods.short_url,
      path: '/pages/buy/buy?id=' + this.id + '&invite_code=' + this.invite_code + '&token=' + this.token,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})