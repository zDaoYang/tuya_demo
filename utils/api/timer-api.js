import request from '../request'
// 定时任务服务

export default {
  
  // 新增一个定制任务
  addTimer (params)  {
    return request({
      name: 'ty-service',
      data: {
        action: 'timer.add',
        params
      }
    })
  },

  // 查询设备下的定时任务列表
  queryTimerList (params)  {
    return request({
      name: 'ty-service',
      data: {
        action: 'timer.list',
        params
      }
    })
  },
  // 删除设备下所有定时任务
  deleteTimer (params)  {
    return request({
      name: 'ty-service',
      data: {
        action: 'timer.delete',
        params
      }
    })
  },

}