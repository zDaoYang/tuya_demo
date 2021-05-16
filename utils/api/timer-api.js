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

  // 新增一个定制任务
  editTimer (params)  {
    return request({
      name: 'ty-service',
      data: {
        action: 'timer.edit',
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

  // 更新某个定时任务组的状态
  updateTimerStatus (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'timer.status',
        params
      }
    })
  },

  // 删除某个分类下面的某个定时组的定时任务
  deleteTimerByGroup (params) {
    return request({
      name: 'ty-service',
      data: {
        action: 'timer.deleteByGroup',
        params
      }
    })
  }

}