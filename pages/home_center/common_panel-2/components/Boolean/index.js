// pages/home_center/common_panel/components/Boolean/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isDemo: Boolean,
    isChecked:Boolean,
    dpCode: String,
    dpName: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange (e) {
      const { isChecked, dpCode } = this.properties
      this.setData({
        isChecked: !isChecked
      })
      wx.showToast({
        title: !isChecked ? '打开成功' : '关闭成功',
        icon: 'none'
      });
      this.triggerEvent('sendDp', { dpCode, value: !isChecked })
    }
  }
})
