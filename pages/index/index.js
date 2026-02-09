Page({
  data: {
    // 清单数据
    checklist: [
      { id: 1, text: '今天专注于自己的目标', checked: false },
      { id: 2, text: '有效管理时间和任务', checked: false },
      { id: 3, text: '练习正念冥想5分钟', checked: false },
      { id: 4, text: '与朋友或家人积极沟通', checked: false },
      { id: 5, text: '保持乐观心态面对挑战', checked: false },
      { id: 6, text: '适当休息，照顾身心健康', checked: false },
      { id: 7, text: '感恩生活中的美好时刻', checked: false }
    ],
    // 图标路径（需自己准备图片，放到/images/目录）
    iconChecked: '/images/icon-checked.png',
    iconUnchecked: '/images/icon-unchecked.png',
    // 生成的图片临时路径
    imagePath: '',
    // 按钮加载状态
    loading: false,
    btnShow: true,        // 原按钮显示状态
    width: 0,      
    height: 0,    
    showPreview: false,   // 预览弹框显示状态
    previewImagePath: '',  // 预览图片的临时路径
    // 每日语录
    dailyQuote: {}
  },
  onShareAppMessage() {
    return {
    title: '',
    imageUrl: this.previewImagePath, // 分享的图片路径
    };
    },
  onShareTimeline() {
    return {
    title: '',
    query: '', // 自定义参数
    imageUrl: this.previewImagePath, // 分享的图片路径
    };
    },

    onLoad: function (options) {
      var that = this;
      
      // 初始化每日语录
      this.initDailyQuote();
      
      // this.widget = this.selectComponent('.widget');
      
      /**
      * 以下这种写法是我看其他博客有遇到这种情况，需要做延迟才能设置成功。
      * 因为当页面没有渲染出来的时候，是拿不到这个节点的
      * 如果有这种问题可以试一下
      * 时间自己定，能拿到就行
      */
      
     
       setTimeout(function(){
        that.widget = that.selectComponent('.widget');
        },1000)

      
  },
  
  initDailyQuote: function() {
    // 定义一些反内耗语录
    const quotes = [
      { content: '内耗是精神的毒药，行动是治愈的良方。', author: '心灵导师' },
      { content: '不要为了无法改变的过去而懊悔，专注于可以改变的未来。', author: '智慧格言' },
      { content: '放下不必要的执念，轻松前行才是上策。', author: '生活哲理' },
      { content: '与其纠结于他人的看法，不如专注自己的成长。', author: '人生感悟' },
      { content: '停止无意义的担忧，让心灵回归平静。', author: '减压秘诀' },
      { content: '接受不完美的自己，拥抱真实的每一天。', author: '自我接纳' },
      { content: '心宽一寸，路宽一丈，少些焦虑多些从容。', author: '心态管理' }
    ];
    
    // 随机选择一条语录
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    this.setData({
      dailyQuote: quote
    });
  },

  // 点击切换勾选状态
  toggleCheck(e) {
    console.log(e, '---')
    const index = e.currentTarget.dataset.index;
    const key = `checklist[${index}].checked`;
    this.setData({
      [key]: !this.data.checklist[index].checked
    });
  },

  generateImage() {
    const that = this;
    const checkedItems = this.data.checklist.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
      wx.showToast({ title: '请至少勾选一项积极行为', icon: 'none' });
      return;
    }
  
    that.setData({ loading: true });
  
    setTimeout(() => {
      const ctx = wx.createCanvasContext('shareCanvas', this);
      const cvsW = 750;
      const cvsH = 1334;
  
      // 1. 绘制大背景（匹配页面背景蓝）
      ctx.setFillStyle('#3AAAF8');
      ctx.fillRect(0, 0, cvsW, cvsH);
  
      // 2. 绘制装饰性大圆（增加设计感）
      ctx.setFillStyle('#4EB5FF');
      ctx.beginPath();
      ctx.arc(cvsW, 0, 400, 0, 2 * Math.PI);
      ctx.fill();
  
      // 3. 绘制主体卡片投影 (黑色色块)
      const cardX = 50;
      const cardY = 150;
      const cardW = 650;
      const cardH = 950;
      ctx.setFillStyle('rgba(0, 0, 0, 0.2)');
      this.drawRoundedRect(ctx, cardX + 15, cardY + 15, cardW, cardH, 30, true);
  
      // 4. 绘制主体卡片 (米黄色)
      ctx.setStrokeStyle('#000000');
      ctx.setLineWidth(6);
      ctx.setFillStyle('#FCFCF2');
      this.drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 30, true, true);
  
      // 5. 绘制标题标题区
      ctx.setFontSize(56);
      ctx.setFillStyle('#000000');
      ctx.setTextAlign('center');
      ctx.fillText('✨ 今日积极行为报告 ✨', cvsW / 2, cardY + 100);
      
      // 标题装饰线
      ctx.setLineWidth(4);
      ctx.moveTo(cvsW / 2 - 150, cardY + 130);
      ctx.lineTo(cvsW / 2 + 150, cardY + 130);
      ctx.stroke();
  
      // 6. 绘制清单项
      const startY = cardY + 220;
      const itemHeight = 85;
      ctx.setTextAlign('left');
      
      checkedItems.forEach((item, index) => {
        const currentY = startY + (index * itemHeight);
        
        // 绘制复选框小框
        ctx.setLineWidth(4);
        ctx.setStrokeStyle('#000000');
        ctx.strokeRect(cardX + 60, currentY - 35, 40, 40);
        
        // 绘制绿色对勾
        ctx.setFontSize(40);
        ctx.setFillStyle('#00B64F');
        ctx.fillText('✔', cardX + 62, currentY - 2);
  
        // 绘制文字
        ctx.setFontSize(32);
        ctx.setFillStyle('#000000');
        // 截断过长文字
        let showText = item.text;
        if (showText.length > 16) showText = showText.substring(0, 15) + '...';
        ctx.fillText(showText, cardX + 120, currentY);
  
        // 绘制虚线分割 (简单模拟)
        ctx.setStrokeStyle('#EEEEEE');
        ctx.setLineWidth(2);
        ctx.moveTo(cardX + 60, currentY + 25);
        ctx.lineTo(cardX + cardW - 60, currentY + 25);
        ctx.stroke();
      });
  
      // 7. 绘制底部印章/总结
      const footerY = cardY + cardH - 120;
      
      // 功德橙色高亮块
      ctx.setFillStyle('#FFD800');
      ctx.setStrokeStyle('#000000');
      ctx.setLineWidth(4);
      this.drawRoundedRect(ctx, cvsW / 2 - 200, footerY - 50, 400, 80, 40, true, true);
      
      ctx.setFontSize(44);
      ctx.setFillStyle('#000000');
      ctx.setTextAlign('center');
      ctx.fillText(`积极行为 +${checkedItems.length}`, cvsW / 2, footerY + 8);
  
      // 8. 绘制小程序提示
      ctx.setFontSize(26);
      ctx.setFillStyle('#666666');
      // ctx.fillText('长按识别二维码，领取你的功德', cvsW / 2, cardY + cardH + 100);
  
      // 完成绘制并导出
      ctx.draw(false, () => {
        wx.nextTick(() => {
          wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            destWidth: cvsW * 2, // 提高清晰度
            destHeight: cvsH * 2,
            success: (res) => {
              that.setData({
                previewImagePath: res.tempFilePath,
                loading: false,
                showPreview: true
              });
              
              // 保存到历史记录
              that.saveToHistory(checkedItems);
              
              wx.showToast({ title: '报告已生成', icon: 'success' });
            },
            fail: () => {
              that.setData({ loading: false });
            }
          }, this);
        });
      });
    }, 200);
  },
  
  /**
   * 辅助方法：绘制圆角矩形
   */
  drawRoundedRect(ctx, x, y, w, h, r, fill = false, stroke = false) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  },
  
  // 保存到历史记录
  saveToHistory: function(checkedItems) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // 创建历史记录对象
    const historyRecord = {
      date: dateStr,
      checkedItems: checkedItems,
      positiveBehaviorCount: checkedItems.length
    };
    
    // 获取现有的历史记录
    let historyList = wx.getStorageSync('checklistHistory') || [];
    
    // 检查是否已经有今天的记录，如果有则替换
    const todayIndex = historyList.findIndex(item => item.date === dateStr);
    if (todayIndex !== -1) {
      historyList[todayIndex] = historyRecord;
    } else {
      // 否则添加新的记录
      historyList.unshift(historyRecord);
    }
    
    // 限制历史记录数量，最多保留30天
    if (historyList.length > 30) {
      historyList = historyList.slice(0, 30);
    }
    
    // 保存回本地存储
    wx.setStorageSync('checklistHistory', historyList);
    
    // 更新统计数据
    this.updateStats();
  },
  
  // 更新统计数据
  updateStats: function() {
    const historyList = wx.getStorageSync('checklistHistory') || [];
    const totalMerits = historyList.reduce((sum, day) => {
      return sum + day.checkedItems.length;
    }, 0);
    
    const stats = {
      totalDays: historyList.length,
      continuousDays: historyList.length, // 简化的连续天数计算
      totalPositiveBehaviors: totalMerits
    };
    
    wx.setStorageSync('dailyStats', stats);
  },
  
  // 跳转到个人中心
  goToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

// 保存图片到相册（弹框按钮触发）
async saveToAlbum() {
  try {
    // 1. 申请保存相册的权限
    await this.authorizeSaveImage();

    // 2. 保存图片
    await new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.previewImagePath,
        success: resolve,
        fail: (err) => reject(err)
      });
    });

    wx.showToast({ title: '保存成功', icon: 'success' });
    this.closePreview(); // 保存成功后关闭弹框

  } catch (err) {
    wx.showToast({ title: '保存失败', icon: 'none' });
    console.error('保存相册失败：', err);
  }
},

// 授权保存相册（封装的权限处理）
authorizeSaveImage() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: resolve,
      fail: () => {
        wx.showModal({
          title: '需要授权',
          content: '请允许保存图片到相册，否则无法完成操作',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.writePhotosAlbum']) {
                    resolve();
                  } else {
                    reject('用户拒绝授权');
                  }
                },
                fail: () => reject('打开设置失败')
              });
            } else {
              reject('用户取消授权');
            }
          }
        });
      }
    });
  });
},

// 关闭预览弹框
closePreview() {
  this.setData({
    showPreview: false,
    btnShow: true // 恢复原按钮显示
  });
},

// 点击图片全屏预览（可选增强）
previewImageFull() {
  wx.previewImage({
    urls: [this.data.previewImagePath],
    current: this.data.previewImagePath
  });
},

  // 保存图片到相册
  saveImage() {
    const that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.previewImagePath,
      success() {
        wx.showToast({ title: '保存成功！快去分享吧' });
      },
      fail(err) {
        if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存到相册',
            success(res) {
              if (res.confirm) {
                wx.openSetting(); // 引导用户去设置页打开权限
              }
            }
          });
        }
      }
    });
  },

  // 跳转到历史记录页面
  goToHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // 跳转到个人中心页面
  goToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  }
})