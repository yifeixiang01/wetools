<template>
  <div id="app"  v-loading.fullscreen.lock="isUpdatingRepo" :element-loading-text="isUpdatingMessage"  element-loading-spinner="el-icon-loading"  element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
    
  </div>
</template>

<script>

import adbkit from '../main/adbkit'
import {ipcRenderer, shell} from 'electron'
import { mapState } from 'vuex'
import fs from 'fs'
import Store from 'electron-store'

const {dialog} = require('electron').remote
const path = require('path')
const store = new Store()

export default {
  name: 'wetools',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      hostIP: state => state.AppConfig.hostIP,
      userName: state => state.AppConfig.userName,
      localDeviceList: state => state.Device.localDeviceList,
      selectedDevice: state => state.Device.selectedDevice,
      isUpdatingRepo: state => state.WeappProject.isUpdatingRepo,
      isUpdatingMessage: state => state.WeappProject.isUpdatingMessage
    })
  },
  created () {
    this.checkConfig() // TODO 此处可以考虑使用路由守卫
    this.onDevices()

    // 检测是否有新版本
    ipcRenderer.send('checkForUpdate')
    ipcRenderer.on('message', (event, text) => {
      console.log(event, text)
      this.tips = text
    })
    ipcRenderer.on('downloadProgress', (event, progressObj) => {
      console.log(progressObj)
      this.downloadPercent = progressObj.percent || 0
    })
    ipcRenderer.on('isUpdateNow', () => {
      ipcRenderer.send('isUpdateNow')
    })

    // 渲染进程控制创建菜单
    ipcRenderer.send('show-context-menu')
    ipcRenderer.on('context-menu-command', (event, text) => {
      console.log(event, text)
      switch (text) {
        case 'openDoc': shell.openExternal('https://www.showdoc.com.cn/wetools?page_id=6294887021426043'); break
        case 'setConfig': this.$route.name !== 'Config' && this.$router.replace('/Config'); break
        case 'createWeapp': this.$route.name !== 'CreateWeapp' && this.$router.replace('/CreateWeapp'); break
        case 'wetools': this.$route.name !== 'Home' && this.$router.replace('/'); break
        case 'importWeapp': dialog.showOpenDialog({properties: ['openDirectory']}, (result) => {
          if (result) {
            let packagePath = path.join(result[0], 'package.json')
            if (fs.existsSync(packagePath)) {
              this.$store.commit('changeCutWeappPro', {cutWeappProPath: result[0]})

              this.$route.name !== 'WeappProject' && this.$router.replace({name: 'WeappProject'})
            } else {
              this.$alert('请打开使用脚手架工具创建的项目！', '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        }); break
        case 'updateRepo': this.$store.dispatch('updateRepo'); break
      }
    })
  },
  methods: {
    // 打开应用时，先检测有没有配置，没有的话，会跳转配置页
    checkConfig () {
      if (!store.get('AppConfig')) {
        this.$router.push({path: '/Config'})
      }
    },
    onDevices () {
      adbkit.onDevices({
        onadd: ({device}) => {
          console.log('有新设备连接', device)
          this.addLocalDevice(device)
        },
        onremove: ({device}) => {
          console.log('设备断开', device)
          let {id: deviceId} = device

          this.$store.commit('removeLocalDevice', {deviceId})
          this.$message({type: 'warning', message: `设备断开：${deviceId}`})
          console.log(this.localDeviceList)
        },
        onend: () => {
          console.log('监听设备失败')
        }
      })
    },
    // 添加本地设备
    addLocalDevice (device) {
      let {id: serial, type: status} = device

      // 设备serial中包含本地hostIP，则是连接的本地共享的设备，不显示
      // 本地列表中已经有相同的设备，则不添加到本地列表里
      let index = this.localDeviceList.findIndex(item => item.deviceId === serial)

      if (serial.indexOf(this.hostIP) === -1 && index === -1) {
        let device = {deviceId: serial, serial, owner: this.userName, status, isShared: false}

        this.$store.commit('addLocalDevice', {device: device})
        this.$message({type: 'success', message: `连接到新设备:${device.deviceId}`})
      }
    }
  }
}
</script>

<style>
  /* CSS */

  /* body{
    background: #EBEEF5;
  } */
</style>
