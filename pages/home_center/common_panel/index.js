// miniprogram/pages/home_center/common_panel/index.js.js
import { getDeviceDetails, deviceControl } from '../../../utils/api/device-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady: false,
    mins: [], // 分钟
    secs: [], // 分钟
    timeStr: '0分0秒',
    timerSeconds: 0, // 倒计时几秒关闭
    temp_timerSeconds: 0,
    isOn: true,
    isShowPicker: false,
    device_switch: false,
    device_id: '3275085650029153ca36',
    device_name: '',
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onLoad(options) {

        
    const { device_id } = options
    if(device_id) {
      this.setData({
        device_id
      })
    }
    
    // mqtt消息监听
    wxMqtt.on('message', this.onMessage)

    this.initMins()

  },

  onShow() {
    this.ajaxGetDeviceDetail()
  },
  
  onHide() {
    clearInterval(this.data.timer)
    wxMqtt.off('message', this.onMessage)

  },

  onUnload() {
    clearInterval(this.data.timer)
    wxMqtt.off('message', this.onMessage)
  },

  onMessage(topic, newVal) {
    const { status } = newVal
    console.error(status)
    this.updateStatus(status)
  },
  // 去定时器页面
  actionToTimer() {
    const { device_id } = this.data
    wx.navigateTo({
      url: `/pages/timer_setting/index?device_id=${device_id}`
    })
  },
  actionShowTimerPoPup() {
    this.setData({
      isShowPicker: true
    })
  },

  actionClosePicker() {
    this.setData({
      isShowPicker: false
    })
  },

  updateStatus(status) {
    const switchItem = status.find(item => item.code === 'switch')
    if(switchItem) {
      this.setSwitchStatus(switchItem.value)
    }

    const countDownItem = status.find(item => item.code === 'countdown_1')
    if(switchItem) {
      this.setData({
        timerSeconds: countDownItem.value
      })
    }
    
  },
  // 开关
  async actionSwitch () {
    const switchVal = !this.data.device_switch

    const { device_id } = this.data

    const { success } = await deviceControl(device_id, 'switch', switchVal)

    // 成功了，更改颜色
    if(success) {
      this.setSwitchStatus(switchVal)
    }
  },

  actionToStatistics() {
    const { device_id } = this.data
    wx.navigateTo({
      url: `/packageA/pages/statistics/home/index?device_id=${device_id}`,
    })
  },
  setSwitchStatus(switchVal) {
    this.setData({
      isOn: !switchVal,
      device_switch: switchVal
    })
    const color = switchVal ? "#1DC36D" : "#444E69"
    
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
      animation: {
        duration: 300,
        timingFunc: 'easeIn'
      }
    })
    wx.setBackgroundColor({
      backgroundColorTop: color, // 顶部窗口的背景色为白色
      backgroundColorBottom: color, // 底部窗口的背景色为白色
    })
  },

  // 初始化数据
  initMins() {
    let n = 0
    let result1 = []
    let result2 = []
    while( n <= 60) {
      result1.push(`${n}` + '分')
      result2.push(`${n}` + '秒')
      n++
    }
    result2.pop()
    this.setData({
      mins: result1,
      secs: result2
    })
  },

  actionOnSwitchChange(e) {
    this.setData({
      isOn: e.detail.value
    })
  },

  actionOnPickerChange(e) {
    const min = e.detail.value[0]
    const sec = e.detail.value[1]
    const temp_timerSeconds = (min) * 60 + sec
    this.setData({
      temp_timerSeconds
    })
  },

  // 设置定时器
  async actionSetTimer() {
    const { device_id, temp_timerSeconds } = this.data
    const { success } = await deviceControl(device_id, 'countdown_1', temp_timerSeconds)
    if(success) {
      this.setData({
        timerSeconds: temp_timerSeconds,
        isShowPicker: false
      })
    }

  },

  ajaxGetDeviceDetail() {
    const { device_id } = this.data
    getDeviceDetails(device_id).then(res => {
      const { product_name, status } = res

      // 设置title
      wx.setNavigationBarTitle({
        title: product_name
      })

      // 设置开关状态
      const device_switch = status.find(item => item.code === 'switch').value
      const timerSeconds = status.find(item => item.code === 'countdown_1').value

      this.setSwitchStatus(device_switch)
      
      this.setData({
        timerSeconds,
        isReady: true
      })
    })
    

  },




  jumpTodeviceEditPage: function(){
    console.log('jumpTodeviceEditPage')
    const { icon, device_id, device_name } = this.data
    wx.navigateTo({
      url: `/pages/home_center/device_manage/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`,
    })
  },



})