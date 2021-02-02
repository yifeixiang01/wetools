<template>
  <div :class="['app-wrapper', !selectedDevice? 'disable': '']" @click="startApp" @contextmenu="mouseRight">
    <el-avatar :src="src" :icon="icon" fit="fill" :shape="shape"></el-avatar>
    <span class="app-name">{{name}}</span>

    <div :class="['operation', showOperation? 'operation-show': '']" @mouseleave="mouseOver">
      <div class="btn danger" @click.stop="clearAppStorage">清缓存</div>
      <div class="btn warning" @click.stop="closeApp">关闭</div>
    </div>
  </div>
</template>
<script>
import adb from '../../main/adb'
import { mapState } from 'vuex'
export default {
  name: 'DeviceApp',
  props: {
    icon: String,
    src: String,
    name: String,
    shape: String,
    packageName: String
  },
  data () {
    return {
      showOperation: false
    }
  },
  watch: {
    selectedDevice (val) {
      if (!val) {
        this.showOperation = false
      }
    }
  },
  computed: {
    ...mapState({
      selectedDevice: state => {
        return state.Device.selectedDevice
      }
    })
  },
  methods: {
    // 打开应用
    startApp () {
      if (this.selectedDevice) {
        adb._startApp({serial: this.selectedDevice.deviceId, packageName: this.packageName}).then(res => {
        }).catch(err => {
          this.$message.error(`打开应用失败 ${err.toString()}`)
        })
      }
    },
    // 关闭应用
    closeApp () {
      if (this.selectedDevice) {
        adb._closeApp({serial: this.selectedDevice.deviceId, appName: this.packageName.split('/')[0]})
        this.showOperation = false
      }
    },
    // 清除应用缓存
    clearAppStorage () {
      if (this.selectedDevice) {
        adb._clearAppStorage({serial: this.selectedDevice.deviceId, appName: this.packageName.split('/')[0]})
        this.showOperation = false
      }
    },
    // 鼠标右击应用图标，打开删除和清缓存按钮
    mouseRight () {
      if (this.selectedDevice) {
        console.log('mouseRight')
        this.showOperation = true
      }
    },
    mouseOver () {
      this.showOperation = false
    }
  }
}
</script>
<style scoped>
  .app-wrapper{
    width: 60px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    position: relative;
    cursor: pointer;
  }
  .app-name{
    width: 100%;
    margin-top: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    color: #606266;
  }
  .operation{
    width: 100%;
    height: 0;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(228, 231, 237, .8);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    cursor: auto;
  }
  .operation .btn {
    width: 100%;
    height: 26px;
    box-sizing: border-box;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    border: 1px solid #DCDFE6;
    text-align: center;
    line-height: 26px;
    cursor: pointer;
  }
  .btn.danger{
    background: #F56C6C
  }
  .btn.warning{
    background: #E6A23C
  }
  .operation-show{
    height: 100%;
  }
  .disable{
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>