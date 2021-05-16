import statisticsApi from '../../../../utils/api/statistics-api'
import { getDeviceDetails } from '../../../../utils/api/device-api'


Page({
  data: {
    isReady: false,
    device_id: '',
    thisDay: '',
    sum: '',
    cur_current: '',
    cur_voltage: '',
    cur_power: '',
    years: [],
  },
  onLoad(options) {
    const { device_id } = options
    this.setData({
      device_id
    })

    this.ajaxGetDetail()
    this.data.timer = setInterval(this.ajaxGetDetail, 1000)
    this.ajaxGetStatisticsAll()
  }, 
  onHide() {
    clearInterval(this.data.timer)
  },
  onUnload() {
    clearInterval(this.data.timer)
  },
  formatyears(years) {
    let result = []
    Object.keys(years).forEach(key => {
      result.push({
        title: key,
        value: this.formatMonths(years[key])
      })
    })
    console.error('====result===')
    console.error(result)
    return result
  },

  formatMonths(months) {
    let result = []
    Object.keys(months).forEach(key => {
      result.unshift({
        title: key,
        value: months[key]
      })
    })
    return result
  },
  // 去图表页
  actionToCharts(e) {
    const { device_id } = this.data
    const { year, month } = e.currentTarget.dataset
    console.error(year + month)
    wx.navigateTo({
      url: `/packageA/pages/statistics/charts/index?device_id=${device_id}&year=${year}&month=${month}`,
    })
  },
  ajaxGetDetail() {
    const { device_id, isReady } = this.data
    getDeviceDetails(device_id).then(res => {
      const cur_current = res.status.find(item => item.code === 'cur_current').value
      const cur_voltage = res.status.find(item => item.code === 'cur_voltage').value
      const cur_power = res.status.find(item => item.code === 'cur_power').value
      this.setData({
        cur_current,
        cur_voltage,
        cur_power,
      })
      if(!isReady) {
        this.setData({
          isReady: true
        })

      }
    })
  },

  ajaxGetStatisticsAll() {
    wx.showLoading({
      title: '加载中'
    })
    setTimeout(() => {
      wx.hideLoading()
    }, 2000)
    const { device_id } = this.data
    statisticsApi.getStatisticsAll({ device_id, code: "add_ele" }).then(res => {
      console.error('====')
      console.error(res)
      const { thisDay, sum, years } = res
      this.setData({
        thisDay,
        sum,
        years: this.formatyears(years),
      })
      this.setData({
        isReady: true
      })
      wx.hideLoading()

    })
  }
});
