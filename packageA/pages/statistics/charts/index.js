import * as echarts from '../../../components/ec-canvas/echarts';
import statisticsApi from '../../../../utils/api/statistics-api'




Page({
  data: {
    isReady: false,
    ec: null,
    device_id: '',
    year: '',
    month: ''
  },
  onLoad(options) {
    const { device_id, year, month } = options
    this.setData({
      device_id,
      year,
      month
    })
    this.ajaxGetMonthsData()
    wx.setNavigationBarTitle({
      title: `${year}年${month}月电量统计`
    })
  },
  onShow() {
  },
  onReady() {
  },

  // 初始化图标参数
  initChartsOption(days) {
    const color = '#ff8315'
    const { year, month } = this.data
    var option = {
      grid: {
        top: '10%',
        bottom: '10%',
        left: '5%',
        right: '5%',
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(days).map(item => {
          const str = item.slice(-4)
          const month = str.slice(0, 2)
          const date = str.slice(-2)
          return month + '-' + date
        })
      },
      yAxis: {
        type: 'value'
       
      },
      series: [{
        data: Object.keys(days).map(item => days[item]),
        type: 'line',
        symbol: 'circle',
        lineStyle: {
          color
        },
        itemStyle: {
          color
        }
    }]
    };
  


    function initChart(canvas, width, height, dpr) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
    

      chart.setOption(option);
      return chart;
    }

    const ec = {
      onInit: initChart,
    }

    this.setData({
      ec,
      isReady: true
    })
  },

  ajaxGetMonthsData() {
    const { device_id, year, month } = this.data
    const start_day = year + month + '01' // 当月开始日期，例如 20210801
    let date = new Date(year + '-' + month)
    date.setMonth(date.getMonth() + 1)
    date.setDate(0)
    const end_day = year + month + date.getDate()
    
    statisticsApi.getStatisticsDays({device_id, start_day, end_day, code: 'add_ele'}).then(res => {
      this.initChartsOption(res.days)
    })
  }
});
