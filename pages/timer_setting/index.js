import timerApi from '../../utils/api/timer-api'

Page({
  data: {
    isReady: false,
    device_id: '',
    isShowPicker: false,
    isOn: false,
    mins: [], // 分钟
    secs: [], // 分钟
    repeatOption: [
      {
        label: '周日',
        value: false
      },
      {
        label: '周一',
        value: false
      },
      {
        label: '周二',
        value: false
      },
      {
        label: '周三',
        value: false
      },
      {
        label: '周四',
        value: false
      },
      {
        label: '周五',
        value: false
      },
      {
        label: '周六',
        value: false
      }
    ],
    time: '00:00',
    loops: '0000000',
    timerList: [], // 定时器列表
    isAddTimer: false, // 此次是否为添加定时器 
    currentGroupId: '',
    pickerValue: [] // picker 的值
  },

  onLoad(options) {
    const { device_id } = options
    this.setData({
      device_id
    })
    this.initMins()
    this.ajaxQueryTimerList()

  },

  actionShowPicker() {
    this.setData({
      isAddTimer: true,
      isShowPicker: true
    })
  },
  
  actionClosePicker() {
    this.setData({
      isAddTimer: false,
      isShowPicker: false
    })
  },

  // 更改定时器状态
  actionChangeTimerStatus(e) {
    const { groupid, timerindex } = e.currentTarget.dataset
    const status = e.detail.value ? 1 : 0
    this.data.timerList[timerindex].timers[0].status = status
    this.setData({
      timerList: this.data.timerList
    })
    this.ajaxUpdateTimerStatus(groupid, status)
  },

  // 开关状态改变
  actionOnSwitchChange(e) {
    this.setData({
      isOn: e.detail.value
    })
  },

  // 时间选择器改变
  actionOnPickerChange(e) {
    const min = `0${e.detail.value[0]}`.slice(-2)
    const sec = `0${e.detail.value[1]}`.slice(-2)
    const time = `${min}:${sec}`
    this.setData({
      time
    })
  },

  // 日期重复选择器改变
  actionCheckBoxChange(e) {
    const value = e.detail.value
    let loops = [0, 0, 0, 0, 0, 0, 0]
    loops = loops.map((item, index) => {
      if(value.includes(index + '')) {
        return 1
      } else {
        return item
      }
    })
    loops = loops.join('')
    this.setData({
      loops: loops
    })
    
  },
  
  transferDateToStr(date) {
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const date1 = `0${date.getDate()}`.slice(-2)
    return `${year}-${month}-${date1}`
  },

  // 添加定时器
  actionSetTimer() {
    const { isOn, loops, time, isAddTimer } = this.data
    let date = ''
    // 未设置loops时，默认次日
    if(loops === '0000000') {
      const currentDate = new Date()
      const currentDateStr = this.transferDateToStr(currentDate)
      const setDateStr = `${currentDateStr} ${time}`
      // 设置的时间超过当前时间，则为今日
      if(currentDate.getTime() < new Date(setDateStr).getTime()) {
        date = currentDateStr.split('-').join('')
      } else { // 否则为明日
        date = `${this.transferDateToStr(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}`.split('-').join('')
      }
    }
    console.error('====set-date====')
    console.error(date)
    if(isAddTimer) {
      this.ajaxAddTimer({
        value: isOn,
        loops,
        time,
        date
      })

    } else {
      this.ajaxEditTimer({
        value: isOn,
        loops,
        time,
        date
      })
      
    }
  },

  actionEdit(e) {
    const { timer, groupid } = e.currentTarget.dataset

    
    const { functions, loops, time } = timer

    const isOn = functions[0].value

    const loopsArr = loops.split('')
    const repeatOption = this.data.repeatOption.map((item, index) => {
      if(loopsArr[index] === '1') {
        item.value = true
      } else {
        item.value = false
      }
      return item
    })
    
    const pickerValue = []
    pickerValue[0] = parseInt(time.split(':')[0])
    pickerValue[1] = parseInt(time.split(':')[1])

    console.error('===pickerValue===')
    console.error(pickerValue)
    this.setData({
      isOn,
      repeatOption,
      pickerValue: JSON.parse(JSON.stringify(pickerValue)),
      loops,
      time
    })

    this.setData({
      currentGroupId: groupid,
      isShowPicker: true
    })
  },

  actionDelete(e) {
    this.ajaxDeleteTimerByGroup(e.currentTarget.dataset.groupid)
  },
  
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },

  handleTouchEnd(e) {
    if(e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if(e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },
  
  handleMovableChange(e) {

    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
  showDeleteButton (e) {
    let timerIndex = e.currentTarget.dataset.timerindex
    this.setXmove(timerIndex, -200)
  },

  hideDeleteButton(e) {
    let timerIndex = e.currentTarget.dataset.timerindex

    this.setXmove(timerIndex, 0)
  },

  setXmove (timerIndex, xmove) {
    let timerList = this.data.timerList
    timerList[timerIndex].xmove = xmove
    
    this.setData({
      timerList
    })
  },

  initMins() {
    let n = 0
    let result1 = []
    while( n <= 23) {
      result1.push(`0${n}`.slice(-2))
      n++
    }
    n = 0
    let result2 = []
    while( n <= 59) {
      result2.push(`0${n}`.slice(-2))
      n++
    }
    this.setData({
      mins: result1,
      secs: result2
    })
  },

  // 查询定时器列表
  async ajaxQueryTimerList() {      
    const { device_id } = this.data
    const data = await timerApi.queryTimerList({
      device_id,
      category: 'test'
    })
    if(data.length === 0) {
      this.setData({
        timerList: [],
        isReady: true
      })
    } else {
      this.setData({
        timerList: data[0].groups,
        isReady: true
      })
    }
  },

  // 添加定时器
  async ajaxAddTimer(params) {
    const { device_id } = this.data
    const { loops, value, time, date } = params
    const success = await timerApi.addTimer({
      device_id,
      category: 'test',
      loops,
      time_zone: '+08:00',
      timezone_id: 'Asia/shanghai',
      instruct: [
        {
          functions:[
            {
              code: "switch",
              value
            }
          ],
          date,
          time
        }
      ],
    })

    if(success) {
      this.actionClosePicker()
      this.ajaxQueryTimerList()
    }
  },
  
  // 编辑定时器
  async ajaxEditTimer(params) {
    const { device_id, currentGroupId } = this.data
    const { loops, value, time } = params
    const success = await timerApi.editTimer({
      device_id,
      category: 'test',
      group_id: currentGroupId,
      loops,
      time_zone: '+08:00',
      timezone_id: 'Asia/shanghai',
      instruct: [
        {
          functions:[
            {
              code: "switch",
              value
            }
          ],
          time
        }
      ],
    })

    if(success) {
      this.actionClosePicker()
      this.ajaxQueryTimerList()
    }
  },

  // 更新某个定时任务组的状态
  async ajaxUpdateTimerStatus(group_id, status) {
    const { device_id } = this.data
    const success = await timerApi.updateTimerStatus({
      device_id,
      category: 'test',
      group_id,
      status
    })
    // let title = ''

    // if(success) {
    //   title = `${status === 1 ? '打开' : '关闭'}成功`
    
    // } else {
    //   title = `${status === 1 ? '打开' : '关闭'}失败`
    // }
    // wx.showToast({
    //   title,
    //   icon: 'none'
    // })
  },

  async ajaxDeleteTimerByGroup(group_id) {
    const { device_id } = this.data
    const success = await timerApi.deleteTimerByGroup({
      device_id,
      category: 'test',
      group_id
    })
    if(success) {
      this.ajaxQueryTimerList()
    }
  }
  

})