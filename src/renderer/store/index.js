import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  actions: {

  },
  getters: {
    selectedWeapp: state => {
      return state.weappList.filter(item => item.selected)
    }
  },
  modules
})
