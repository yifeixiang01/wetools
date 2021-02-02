import Store from 'electron-store'
const store = new Store()

const state = {
  weappList: store.get('weappList') || [],
  selectedWeapp: null,
  aimDirection: null
}

const mutations = {
  setWeappList: (state, payload) => {
    console.log('setWeappList', payload)
    state.weappList = payload.weappList
    store.set('weappList', payload.weappList)
  },
  // 设置选择的小程序
  setSelectedWeapp: (state, payload) => {
    state.selectedWeapp = payload.selectedWeapp
  },
  // 设置车机上要push的文件夹
  setAimDirection: (state, payload) => {
    state.aimDirection = payload.aimDirection
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
