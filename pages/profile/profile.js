Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    dailyStats: {
      totalDays: 0,
      continuousDays: 0,
      totalPositiveBehaviors: 0
    },
    healthTip: '保持积极心态，每天都是新的开始。'
  },

  onLoad: function() {
    this.loadUserData();
    this.loadHealthTip();
  },

  onShow: function() {
    this.updateStats();
  },

  loadUserData: function() {
    // 获取本地存储的用户数据
    const userInfo = wx.getStorageSync('userInfo') || null;
    const stats = wx.getStorageSync('dailyStats') || {
      totalDays: 0,
      continuousDays: 0,
      totalPositiveBehaviors: 0
    };

    this.setData({
      userInfo: userInfo,
      hasUserInfo: !!userInfo,
      dailyStats: stats
    });
  },

  updateStats: function() {
    // 更新统计数据
    const checklistData = wx.getStorageSync('checklistHistory') || [];
    const totalMerits = checklistData.reduce((sum, day) => {
      // 兼容旧版本数据结构
      if (day.positiveBehaviorCount !== undefined) {
        return sum + day.positiveBehaviorCount;
      }
      return sum + day.checkedItems.length;
    }, 0);

    const stats = {
      totalDays: checklistData.length,
      continuousDays: this.calculateContinuousDays(checklistData),
      totalPositiveBehaviors: totalMerits
    };

    this.setData({
      dailyStats: stats
    });

    // 同步到本地存储
    wx.setStorageSync('dailyStats', stats);
  },

  calculateContinuousDays: function(history) {
    if (history.length === 0) return 0;
    
    // 简单计算连续天数逻辑（实际应用中可能需要更精确的时间判断）
    return history.length > 0 ? Math.min(history.length, 30) : 0; // 示例逻辑
  },

  calculateLevel: function(totalMerits) {
    // 根据积极行为总数计算等级
    if (totalMerits >= 100) return 5;
    if (totalMerits >= 50) return 4;
    if (totalMerits >= 20) return 3;
    if (totalMerits >= 10) return 2;
    return 1;
  },

  // 获取总积极行为数
  getTotalMerits: function() {
    return this.data.dailyStats.totalPositiveBehaviors || 0;
  },

  getUserProfile: function() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: () => {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  navigateToHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // 返回首页
  goToHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 显示成就系统
  showAchievements: function() {
    wx.showModal({
      title: '成就系统',
      content: '您已完成 ' + this.data.dailyStats.totalPositiveBehaviors + ' 项积极行为，继续加油！',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 显示心理健康小贴士
  showTips: function() {
    wx.showModal({
      title: '心理健康小贴士',
      content: '保持积极心态，每天都是新的开始。适当放松，与朋友交流，规律作息有助于维护心理健康。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 加载心理健康小贴士
  loadHealthTip: function() {
    const tips = [
      '保持积极心态，每天都是新的开始。',
      '适当放松，避免过度焦虑。',
      '与朋友或家人分享你的感受。',
      '规律作息，保证充足睡眠。',
      '适量运动，释放压力。',
      '专注于当下，减少胡思乱想。',
      '学会接受不完美的自己。',
      '感恩生活中的小确幸。'
    ];
    
    const randomIndex = Math.floor(Math.random() * tips.length);
    this.setData({
      healthTip: tips[randomIndex]
    });
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '我的心理健康历程',
      path: '/pages/profile/profile'
    };
  }
})