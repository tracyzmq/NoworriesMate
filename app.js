// 小程序启动时执行
App({
  onLaunch() {
    console.log('反内耗小程序启动啦！');
  },
  // 可以在这里定义一些全局数据，比如用户昵称
  globalData: {
    userInfo: null
  }
})