// miniprogram/pages/home_center/common_panel/index.js.js
import { getDevFunctions, getDeviceDetails, deviceControl } from '../../../utils/api/device-api'
import { getStatisticsAllType, getStatisticsTotal, getStatisticsDays } from '../../../utils/api/statistics-api'
import timerApi from '../../../utils/api/timer-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mins: [], // 分钟
    secs: [], // 分钟
    timeStr: '15分0秒',
    isOn: true,
    isShowPicker: false,
    device_switch: false,
    device_id: '',
    device_name: '',
    titleItem: {
      name: '',
      value: '',
    },
    roDpList: {}, //只上报功能点
    rwDpList: {}, //可上报可下发功能点
    isRoDpListShow: false,
    isRwDpListShow: false,
    forest: '../../../image/forest@2x.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    
    
    const { device_id } = options
    this.setData({ device_id })
    // getStatisticsAllType(device_id)
    // getStatisticsTotal({ device_id, code: "add_ele"}).then(res => {
    //   console.error(res)
    // })
    // getStatisticsDays({ device_id, code: "add_ele", start_day: '20210425', end_day: '20210425'}).then(res => {
    //   console.error(res)
    // })
    // timerApi.deleteTimer({
    //   device_id
    // })
    
    // timerApi.queryTimerList({
    //   device_id
    // })
    
    
    // mqtt消息监听
    wxMqtt.on('message', (topic, newVal) => {
      const { status } = newVal
      console.log(newVal)
      this.updateStatus(status)
    })

    this.initMins()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    const { device_id } = this.data
    console.error(device_id)
    const [{ name, status, icon }, { functions = [] }] = await Promise.all([
      getDeviceDetails(device_id),
      getDevFunctions(device_id),
    ]);

    const { roDpList, rwDpList } = this.reducerDpList(status, functions)

    // 获取头部展示功能点信息
    let titleItem = {
      name: '',
      value: '',
    };
    if (Object.keys(roDpList).length > 0) {
      let keys = Object.keys(roDpList)[0];
      titleItem = roDpList[keys];
    } else {
      let keys = Object.keys(rwDpList)[0];
      titleItem = rwDpList[keys];
    }

    const roDpListLength = Object.keys(roDpList).length
    const isRoDpListShow = Object.keys(roDpList).length > 0
    const isRwDpListShow = Object.keys(rwDpList).length > 0

    this.setData({ titleItem, roDpList, rwDpList, device_name: name, isRoDpListShow, isRwDpListShow, roDpListLength, icon })
  },
  
  actionToTimer() {
    wx.navigateTo({
      url: '/pages/timer_setting/index'
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

  // 开关
  actionSwitch () {
    const switchVal = !this.data.device_switch
    this.setData({
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
    let n = 1
    let result1 = []
    let result2 = ['0秒']
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
    const timeStr = `${min + 1}分${sec}秒`
    this.setData({
      timeStr
    })
  },

  // 设置定时器
  actionSetTimer() {
    this.setData({
      isShowPicker: false
    })
  },

  // 分离只上报功能点，可上报可下发功能点
  reducerDpList: function (status, functions) {
    // 处理功能点和状态的数据
    let roDpList = {};
    let rwDpList = {};
    if (status && status.length) {
      status.map((item) => {
        const { code, value } = item;
        let isExit = functions.find(element => element.code == code);
        if (isExit) {
          let rightvalue = value
          // 兼容初始拿到的布尔类型的值为字符串类型
          if (isExit.type === 'Boolean') {
            rightvalue = value == 'true'
          }

          rwDpList[code] = {
            code,
            value: rightvalue,
            type: isExit.type,
            values: isExit.values,
            name: isExit.name,
          };
        } else {
          roDpList[code] = {
            code,
            value,
            name: code,
          };
        }
      });
    }
    return { roDpList, rwDpList }
  },

  sendDp: async function (e) {
    const { dpCode, value } = e.detail
    const { device_id } = this.data
    this.data.titleItem.value = value
    this.setData({
      titleItem: this.data.titleItem
    })
    const { success } = await deviceControl(device_id, dpCode, value)
  },

  updateStatus: function (newStatus) {
    let { roDpList, rwDpList, titleItem } = this.data

    newStatus.forEach(item => {
      const { code, value } = item

      if (typeof roDpList[code] !== 'undefined') {
        roDpList[code]['value'] = value;
      } else if (rwDpList[code]) {
        rwDpList[code]['value'] = value;
      }
    })

    // 更新titleItem
    if (Object.keys(roDpList).length > 0) {
      let keys = Object.keys(roDpList)[0];
      titleItem = roDpList[keys];
    } else {
      let keys = Object.keys(rwDpList)[0];
      titleItem = rwDpList[keys];
    }
 
    this.setData({ titleItem, roDpList: { ...roDpList }, rwDpList: { ...rwDpList } })
  },

  jumpTodeviceEditPage: function(){
    console.log('jumpTodeviceEditPage')
    const { icon, device_id, device_name } = this.data
    wx.navigateTo({
      url: `/pages/home_center/device_manage/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`,
    })
  },



})