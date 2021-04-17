//app.js
import wxMqtt from './utils/mqtt/wxMqtt'
import { Provider } from './libs/wechat-weapp-redux.min';
import { configStore } from './utils/store/store';

const store = configStore();

App(Provider(store)({
  onLaunch: async function() {
    // wx.cloud.init()
    // wxMqtt.connectMqtt()
    
    // 初始化云环境
    const { miniProgram } = wx.getAccountInfoSync();
    wx.cloud.init({ env: `ty-${miniProgram.appId}` });


    wxMqtt.on('close', (errorMsg) => {
      wxMqtt.connectMqtt()
      console.log('errorMsg: mqttClose', errorMsg);
    })

    wxMqtt.on('error', (errorMsg) => {
      wxMqtt.connectMqtt()
      console.log('errorMsg: mqttError', errorMsg);
    })
  }
}))