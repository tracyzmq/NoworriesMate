// 主页面的逻辑与数据
Page({
  data: {
    // 清单数据
    checklist: [
      { id: 1, text: '领导的饼，今天一口没吃', checked: false },
      { id: 2, text: '同事的锅，今天成功甩走', checked: false },
      { id: 3, text: '内心的戏，今天只演了5分钟', checked: false },
      { id: 4, text: '下班消息，已读未回，稳如泰山', checked: false },
      { id: 5, text: '无意义会议，全程静音，神游天外', checked: false },
      { id: 6, text: '看到别人卷，内心毫无波澜甚至想笑', checked: false },
      { id: 7, text: '工作出小错，默念“问题不大”三遍', checked: false }
    ],
    // 图标路径（需自己准备图片，放到/images/目录）
    iconChecked: '/images/icon-checked.png',
    iconUnchecked: '/images/icon-unchecked.png',
    // 生成的图片临时路径
    imagePath: '',
    // 按钮加载状态
    loading: false
  },

  // 点击切换勾选状态
  toggleCheck(e) {
    const index = e.currentTarget.dataset.index;
    const key = `checklist[${index}].checked`;
    this.setData({
      [key]: !this.data.checklist[index].checked
    });
  },

  // 生成分享图片 (修正版)
generateImage() {
  const that = this;
  
  // 0. 检查是否有勾选项目
  const checkedCount = this.data.checklist.filter(item => item.checked).length;
  if (checkedCount === 0) {
    wx.showToast({
      title: '请至少勾选一项功德',
      icon: 'none'
    });
    return;
  }

  that.setData({ loading: true });

  // 1. 使用延时确保视图更新后再开始绘制（一个小技巧）
  setTimeout(() => {
    // 2. 创建画布上下文
    const ctx = wx.createCanvasContext('shareCanvas', this);
    const canvasWidth = 750;
    const canvasHeight = 1334;

    // 3. 绘制纯色背景
    ctx.setFillStyle('#FFFAF0'); // 淡米黄色背景
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 4. 绘制标题
    ctx.setFontSize(48);
    ctx.setFillStyle('#333333');
    ctx.setTextAlign('center');
    ctx.fillText('✨ 今日功德报告 ✨', canvasWidth / 2, 120);

    // 5. 绘制副标题（日期）
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    ctx.setFontSize(30);
    ctx.setFillStyle('#666666');
    ctx.fillText(dateStr, canvasWidth / 2, 180);

    // 6. 绘制已勾选的清单内容
    ctx.setFontSize(36);
    ctx.setFillStyle('#555555');
    ctx.setTextAlign('left');
    let yPos = 260; // 起始Y坐标
    const lineHeight = 70; // 行高
    const leftPadding = 80; // 左侧边距

    this.data.checklist.forEach(item => {
      if (item.checked) {
        // 处理长文本换行（简单版）
        const text = '✅ ' + item.text;
        ctx.fillText(text, leftPadding, yPos);
        yPos += lineHeight;
      }
    });

    // 7. 绘制统计结果
    ctx.setFontSize(42);
    ctx.setFillStyle('#FF8C00'); // 橙色
    ctx.setTextAlign('center');
    ctx.fillText(`功德 +${checkedCount}，内耗 -99%`, canvasWidth / 2, yPos + 80);

    // 8. 绘制引导文案和小程序码提示
    ctx.setFontSize(28);
    ctx.setFillStyle('#999999');
    ctx.fillText('—— 扫一扫，测测你的内耗抵抗力 ——', canvasWidth / 2, yPos + 150);

    // 9. 绘制底部装饰线
    ctx.setStrokeStyle('#EEEEEE');
    ctx.setLineWidth(2);
    ctx.moveTo(100, yPos + 180);
    ctx.lineTo(canvasWidth - 100, yPos + 180);
    ctx.stroke();

    // 【关键修复步骤】确保绘制完成后再导出图片
    ctx.draw(false, () => {
      // 这个回调函数确认绘制已经完成
      wx.nextTick(() => {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          success: (res) => {
            console.log('图片生成成功，临时路径:', res.tempFilePath);
            console.log('准备设置的 imagePath:', res.tempFilePath);
            that.setData({
              imagePath: res.tempFilePath,
              loading: false
            });
            wx.showToast({
              title: '生成成功！',
              icon: 'success'
            });
          },
          fail: (err) => {
            console.error('canvasToTempFilePath 失败:', err);
            wx.showToast({
              title: '生成失败，请重试',
              icon: 'none'
            });
            that.setData({ loading: false });
          }
        }, this); // 注意这个 this 是必须的
      });
    });
  }, 100); // 延迟100毫秒开始绘制
},

  // 保存图片到相册
  saveImage() {
    const that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
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
  }
})