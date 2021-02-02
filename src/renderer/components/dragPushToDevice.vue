<template>
    <div class="area-draginto" @drop="onDrop($event)" @dragover="onDragover($event)"><span>将小程序包</span><span>拖放到此处</span></div>
</template>
<script>
import adb from '../../main/adb'
import { mapState } from 'vuex'
export default {
  name: 'DragPushToDevice',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      selectedDevice: state => state.Device.selectedDevice,
      AppConfig: state => state.AppConfig,
      selectedWeapp: state => state.Weapp.selectedWeapp,
      aimDirection: state => state.Weapp.aimDirection
    })
  },
  methods: {
    onDrop (e) {
      e.preventDefault()
      let resourcePath = e.dataTransfer.files[0].path
      this.$emit('weappLoading', {done: false, type: 'success', message: `正在将小程序包push到车机...`})

      // 设备上的文件存储目录
      let aimPathInDevice = this.aimDirection.name === '本地调试包' ? '/sdcard/moss/weapp/debug.wxapkg' : `data/data/com.tencent.wecarmas/files/moss/${this.aimDirection.name}/pkg/${this.aimDirection.appName}.wxapkg`
      // 判断源文件是否是小程序包
      if (resourcePath.indexOf('.wxapkg') > -1) {
        if (this.selectedDevice) {
          adb._pushFileToDevice({serial: this.selectedDevice.deviceId, filePath: resourcePath, aimPath: aimPathInDevice}).then(() => {
            this.$message({type: 'success', message: `小程序成功push到设备!`})
            this.$emit('weappLoading', {done: true, type: 'success', message: `小程序成功push到设备`})
          }).catch(err => {
            this.$emit('weappLoading', {done: true, type: 'error', message: err.toString()})
          })
        }
      } else {
        this.$emit('weappLoading', {done: true, type: 'error', message: `请放置正确的小程序包`})
      }
    },
    onDragover (e) {
      e.preventDefault()
    }
  }
}
</script>
<style scoped>

</style>