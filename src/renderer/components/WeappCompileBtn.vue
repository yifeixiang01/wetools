<template>
  <el-button type="primary" :disabled="!selectedWeapp" @click="startCompile">开始编译</el-button>
</template>
<script>
// import adb from '../../main/adb/index'
import tools from '../../main/tools'
import adb from '../../main/adb'
import { mapState } from 'vuex'
export default {
  name: 'WeappCompileBtn',
  props: {
    text: String,
    cmdFn: String,
    params: {}
  },
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
  mounted () {

  },
  watch: {
    params (val) {
      console.log('btn', val)
    }
  },
  methods: {
    // 开始编译小程序
    startCompile () {
      console.log('开始编译小程序')
      this.$emit('weappLoading', {done: false, type: 'success', message: `正在编译${this.selectedWeapp.name}小程序...`})
      // 小程序编译源文件路径
      let resourcePath = `${this.AppConfig.weappCompilePath}/__APP__.wxapkg`
      // 小程序包保存路径
      let aimPath = `${this.AppConfig.outputPath}/${this.selectedWeapp.appName}.wxapkg`

      tools._compileWeapp(this.selectedWeapp.name, this.selectedWeapp.path, this.AppConfig.weappCompilePath, this.AppConfig.wechatDevtoolsPath).then(() => {
        return tools._copyFile(resourcePath, aimPath)
      }).then(() => {
        this.$emit('weappLoading', {done: true, type: 'success', message: `小程序编译完成`})

        // 当前有选择设备，并且已选择push的目录，则将小程序包push到设备目录下
        if (this.aimDirection) {
          console.log('----正在将小程序包push到车机...')
          this.$emit('weappLoading', {done: false, type: 'success', message: `正在将小程序包push到车机...`})
          let aimPathInDevice = this.aimDirection.name === '本地调试包' ? '/sdcard/moss/weapp/debug.wxapkg' : `data/data/com.tencent.wecarmas/files/moss/${this.aimDirection.name}/pkg/${this.aimDirection.appName}.wxapkg`
          return adb._pushFileToDevice({serial: this.selectedDevice.deviceId, filePath: aimPath, aimPath: aimPathInDevice}).then(res => {
            this.$emit('weappLoading', {done: true, type: 'success', message: `小程序已push到设备`})
          })
        }
      }).catch(err => {
        console.log(err)
        this.$emit('weappLoading', {done: true, type: 'danger', message: err.toString()})
      })
    }
  }
}
</script>
<style scoped>

</style>