<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import adbkit from '../main/adbkit'
import { mapState } from 'vuex'
import Store from 'electron-store'
const store = new Store()
export default {
  name: 'wetools',
  computed: {
    ...mapState({
      hostIP: state => state.AppConfig.hostIP,
      userName: state => state.AppConfig.userName,
      localDeviceList: state => state.Device.localDeviceList,
      selectedDevice: state => state.Device.selectedDevice
    })
  },
  created () {
    this.checkConfig() // TODO 此处可以考虑使用路由守卫
    this.onDevices()
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
