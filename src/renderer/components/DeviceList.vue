<template>
  <div>
    <el-table ref="deviceTable" :data="localDeviceList" highlight-current-row style="width: 100%" @current-change="handleCurrentChange">
      <el-table-column  label="DeviceId"  prop="deviceId"></el-table-column>
      <el-table-column  label="Owner"  prop="owner"></el-table-column>
      <el-table-column  label="Serial"  prop="serial"></el-table-column>
      <el-table-column  label="status"  prop="status"></el-table-column>
      <!-- <el-table-column  label="操作" align="right">
        <template slot-scope="scope">
          <el-button  size="mini"  @click="handleShare(scope.$index, scope.row)">共享</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>

import { mapState } from 'vuex'
export default {
  name: 'DeviceList',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      localDeviceList: state => state.Device.localDeviceList,
      selectedDevice: state => state.Device.selectedDevice

    })
  },
  mounted () {
    console.log(this.localDeviceList)
    this.setCurrentDevice()
  },
  methods: {
    setCurrentDevice () {
      this.selectedDevice && this.$refs.deviceTable.setCurrentRow(this.selectedDevice)
    },
    // 设置选择的设备
    handleCurrentChange (row) {
      this.$store.commit('setSelectedDevice', {selectedDevice: row})
    },
    handleShare (index, row) {

    }
  }
}
</script>
<style scoped>

</style>