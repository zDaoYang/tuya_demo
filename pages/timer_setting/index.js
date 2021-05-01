Page({
  data: {
    isShowPicker: true,
    isOn: false,
    mins: [], // 分钟
    secs: [], // 分钟
    repeatOption: [
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
        value: true
      },
      {
        label: '周四',
        value: false
      },
      {
        label: '周五',
        value: true
      },
      {
        label: '周六',
        value: false
      },
      {
        label: '周日',
        value: true
      },
    ]
  },

  onLoad() {
    this.initMins()
  },

  actionClosePicker() {
    this.setData({
      isShowPicker: false
    })
  },
  initMins() {
    let n = 1
    let result1 = []
    while( n <= 24) {
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
  }
})