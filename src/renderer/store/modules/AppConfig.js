import adb from '../../../main/tools/index.js'
import Store from 'electron-store'

const store = new Store()
let AppConfig = store.get('AppConfig') || {userName: '', wechatDevtoolsPath: '', weappCompilePath: '', outputPath: ''}
const state = {
  hostIP: adb._getIPAddress(), // 电脑IP
  userId: '', // 车机共享功能用到，该用户在服务端的id
  userName: AppConfig.userName, // 用户名，车机共享功能用到，用于区别不同用户车机
  wechatDevtoolsPath: AppConfig.wechatDevtoolsPath, // 小程序开发工具安装目录
  weappCompilePath: AppConfig.weappCompilePath, // 小程序编译后保存目录
  outputPath: AppConfig.outputPath // 文件输出目录
}

const mutations = {
  setConfig: (state, payload) => {
    Object.assign(state, payload)
    store.set('AppConfig', state)
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
