<template>
  <el-button type="primary" size="medium" :disabled="!selectedDevice" @click="adbCmd">{{text}}</el-button>
</template>
<script>
import adb from '../../main/adb/index'
import { mapState } from 'vuex'
export default {
  name: 'AppList',
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
      selectedDevice: state => state.Device.selectedDevice
    })
  },
  mounted () {

  },
  methods: {
    adbCmd () {
      adb[this.cmdFn]({serial: this.selectedDevice.deviceId, ...this.params}).then(res => {
        this.$emit('adbcallback', {message: res})
      }).catch(err => {
        this.$message.error(err.toString())
      })
    }
  }
}
</script>
<style scoped>

</style>