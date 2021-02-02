
const state = {
  localDeviceList: [],
  remoteDeviceList: [],
  selectedDevice: null
}

const mutations = {
  setLocalDeviceList: (state, payload) => {
    console.log('设置设备列表')
    state.localDeviceList = payload.localDeviceList
  },
  setSelectedDevice: (state, payload) => {
    state.selectedDevice = payload.selectedDevice
  },
  addLocalDevice: (state, payload) => {
    state.localDeviceList.unshift(payload.device)
    // 如果当前没有选择的设备，就将列表的第一个设备设置为选择
    if (!state.selectedDevice) {
      state.selectedDevice = payload.device
    }
  },
  removeLocalDevice: (state, payload) => {
    state.localDeviceList = state.localDeviceList.filter(device => device.deviceId !== payload.deviceId)
    console.log('移除设备', state.localDeviceList)
    // 如果断开的设备是当前选择的设备，则将选择的设备清空
    if (state.selectedDevice && state.selectedDevice.deviceId === payload.deviceId) {
      state.selectedDevice = null
    }
  }
}

const actions = {

}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
