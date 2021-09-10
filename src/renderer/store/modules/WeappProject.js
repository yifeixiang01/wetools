
const download = require('download-git-repo')
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')

const state = {
  isUpdatingRepo: false, // 是否正在更新代码
  isUpdatingMessage: '', // 更新代码时提示信息
  modules: [], // 远程仓库代码中模块信息
  repoModules: [], // 格式化后的模块信息
  repoPath: '', // 远程仓库代码在本地的存储路径
  cutWeappProPath: '' // 当前导入的小程序的路径
}

const mutations = {
  changeCutWeappPro (state, payload) {
    console.log('store 切换小程序', payload)
    state.cutWeappProPath = payload.cutWeappProPath
  },
  // 获取模块配置内容
  getModules (state) {
    console.log('开始获取代码库配置信息')
    let file = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'extraResources/templates' : '/resources/extraResources/templates', 'package.json')
    if (fs.existsSync(file)) {
      let config = fs.readFileSync(file, 'utf8')
      state.modules = JSON.parse(config).modules
      console.log('代码库模块', state.modules)
    }
  }
}

const actions = {
  updateRepo ({commit, state}) {
    console.log('正在更新代码库')
    state.isUpdatingRepo = true
    state.isUpdatingMessage = '正在拉取远程仓库代码。。。'
    let dir = path.join(
      process.cwd(),
      process.env.NODE_ENV === 'development'
        ? 'extraResources/templates'
        : '/resources/extraResources/templates'
    )
    // 下载前先保证文件夹下没有其它文件
    rimraf.sync(dir, {})
    // git clone
    download(
      'direct:git@github.com:yifeixiang01/weapp--scaffold.git',
      dir,
      { clone: true },
      (err) => {
        console.log(err ? 'Error' : 'Success', err)
        let configPath = path.join(dir, 'package.json')
        if (fs.existsSync(configPath)) {
          console.log('存在package.json')
          state.isUpdatingMessage = '代码拉取成功！'

          commit('getModules')
        } else {
          console.log('不存在package.json')
          this.isUpdatingMessage = '远程代码拉取失败！'
        }

        // 500ms后隐藏loading以及提示信息
        setTimeout(() => {
          state.isUpdatingRepo = false
        }, 500)
      }
    )
  }
}
const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
