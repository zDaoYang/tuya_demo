import request from '../request'
// 统计服务

export default {
  
  // 获取设备支持的统计类型
  getStatisticsAllType (device_id)  {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.allType',
        params: {
          device_id
        }
      }
    })
  },
  // 获取历史总电量
  getStatisticsTotal (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.total',
        params
      }
    })
  },

  // 按分钟统计
   getStatisticsQuarters (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.quarters',
        params
      }
    })
  },

  // 按小时统计
   getStatisticsHours (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.hours',
        params
      }
    })
  },
  
  // 按天统计
  getStatisticsDays (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.days',
        params
      }
    })
  },
  
  // 按星期统计
  getStatisticsWeeks (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.weeks',
        params
      }
    })
  },

  // 按月统计
  getStatisticsMonths (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.months',
        params
      }
    })
  },

  // 获取结果累加值
  getStatisticsAll (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.all',
        params
      }
    })
  },

}