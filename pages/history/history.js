Page({
  data: {
    historyList: [],
    totalMerits: 0,
    averagePerDay: 0
  },

  onLoad: function() {
    this.loadHistory();
  },

  onShow: function() {
    this.loadHistory();
  },

  loadHistory: function() {
    // 获取本地存储的历史记录
    const history = wx.getStorageSync('checklistHistory') || [];
    
    // 计算统计数据
    const totalMerits = history.reduce((sum, day) => {
      // 兼容旧版本数据结构
      if (day.positiveBehaviorCount !== undefined) {
        return sum + day.positiveBehaviorCount;
      }
      return sum + day.checkedItems.length;
    }, 0);
    
    const averagePerDay = history.length > 0 ? Math.round((totalMerits / history.length) * 100) / 100 : 0;
    
    this.setData({
      historyList: history,
      totalMerits: totalMerits,
      averagePerDay: averagePerDay
    });
  },

  // 删除某条历史记录
  deleteHistory: function(e) {
    const index = e.currentTarget.dataset.index;
    const historyList = [...this.data.historyList];
    historyList.splice(index, 1);
    
    this.setData({
      historyList: historyList
    });
    
    // 更新本地存储
    wx.setStorageSync('checklistHistory', historyList);
    
    // 重新计算统计数据
    this.calculateStats();
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  // 清空所有历史记录
  clearAllHistory: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: [],
            totalMerits: 0,
            averagePerDay: 0
          });
          wx.removeStorageSync('checklistHistory');
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 计算统计数据
  calculateStats: function() {
    const history = this.data.historyList;
    const totalMerits = history.reduce((sum, day) => {
      // 兼容旧版本数据结构
      if (day.positiveBehaviorCount !== undefined) {
        return sum + day.positiveBehaviorCount;
      }
      return sum + day.checkedItems.length;
    }, 0);
    
    const averagePerDay = history.length > 0 ? Math.round((totalMerits / history.length) * 100) / 100 : 0;
    
    this.setData({
      totalMerits: totalMerits,
      averagePerDay: averagePerDay
    });
  },

  // 返回首页
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 跳转到个人中心
  goToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  }
})