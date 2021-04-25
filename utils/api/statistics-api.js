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
  // 获取设备支持的统计类型
  getStatisticsTotal (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'statistics.total',
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
  }

}