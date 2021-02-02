<template>
  <div> 
    <!-- <el-tabs v-model="activeName" stretch @tab-click="handleClick">
      <el-tab-pane label="小程序" name="first"><weapp-list/></el-tab-pane>
      <el-tab-pane label="设备管理" name="second"><device-list/></el-tab-pane>
      <el-tab-pane label="应用列表" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs> -->
    <landing-page></landing-page>
  </div>
</template>
<script>
import WeappList from '../components/WeappList.vue'
import DeviceList from '../components/DeviceList.vue'
import LandingPage from '../components/LandingPage.vue'
export default {
  name: 'Home',
  components: {
    WeappList,
    DeviceList,
    LandingPage
  },
  data () {
    return {
      activeName: 'second'
    }
  },
  mounted () {

  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      this.currentRow = val
    }

  }
}
</script>
<style scoped>

</style>