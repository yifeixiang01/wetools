<template>
  <el-container>
    <el-header style="height: 20px; color: #303133; margin-bottom: 10px;">
      <div class="title">
        <span>{{title}}</span> 
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="toConfigPage">项目配置</el-button> -->
        <el-button style="float: right; padding: 3px 0" type="text" @click="openConfig('device')">管理</el-button>
      </div>
    </el-header>

    <el-main>
      <!-- 编译小程序 -->
      <el-card ref="weappCard" class="box-card weappCard" body-style="height: 100px;" v-loading="!loadingEvent.done" :element-loading-text="!loadingEvent.done? loadingEvent.message: ''"  element-loading-spinner="el-icon-loading"  element-loading-background="rgba(0, 0, 0, 0.8)">
        <div slot="header" class="card-header">
          <span>小程序操作</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="openConfig('weapp')">设置</el-button>
        </div>
        <el-row>
          <el-col :span="18">
            <el-row>
              <el-col :span="11">
                <el-select v-model="selectedWeappIndex" clearable placeholder="请选择编译的小程序" style="margin-right: 30px;">
                  <el-option  v-for="(item, index) in weappCompileList"  :key="item.appName" :label="item.name"  :value="index"></el-option>
                </el-select>
              </el-col>
              <el-col :span="2">
                <i class="el-icon-right" style="margin-top: 10px; color: #409EFF;"></i>
              </el-col>
              <el-col :span="11">
                <el-select v-model="pushDirectionIndex" clearable :disabled="!selectedDevice" placeholder="请选择车机文件夹" style="margin-right: 30px;">
                  <el-option label="本地调试包" :value="0"></el-option>
                  <el-option  v-for="(item, index) in weappList"  :key="item.appName" :label="item.name"  :value="index+1"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <div style="height: 50px; display: flex; align-items: flex-end;">
                  <el-link :underline="false" type="warning">{{weappTitle}}</el-link>
              </div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <!-- 拖拽放置文件区域 -->
            <drag-push-to-device v-if="selectedWeappIndex === '' && pushDirectionIndex !== '' && selectedDevice" @weappLoading="weappCompileCallback"/>
            <!-- 小程序编译按钮 -->
            <weapp-compile-btn v-else-if="selectedWeappIndex !== ''" @weappLoading="weappCompileCallback"/>
          </el-col> 
        </el-row>
      </el-card>

      <!-- 应用管理 -->
      <el-card class="box-card" body-style="height: 75px;">
        <div slot="header">
          <span>应用管理</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="openConfig('appList')">设置</el-button>
        </div>
        <el-row>
          <el-col :span="4">
            <device-app :src="require('../assets/wecarmas.png')" name="小场景" shape="circle" package-name="com.tencent.wecarmas/com.tencent.wecarmas.ui.activity.HomeActivity"/>
          </el-col>
          <el-col :span="4">
            <device-app :src="require('../assets/wcenter.png')" name="活动中心" shape="circle" package-name="com.tencent.wcenter/com.tencent.wcenter.MainActivity"/>
          </el-col>
          <el-col :span="4">
            <device-app src="" :icon="'el-icon-s-custom'" name="用户中心" shape="circle" package-name="com.tencent.wecar/com.tencent.wecar.MainActivity"/>
          </el-col>
          <el-col :span="4">
            <device-app :src="require('../assets/wecar.png')" name="腾讯随行" shape="square" package-name="com.autopai.usercenter/com.tencent.wecar.MainActivity"/>
          </el-col>
          
          <!-- <el-col :span="4" v-for="item in appList" :key="item.name">
            
            <device-app :src="item.src" :icon="item.icon" :name="item.name" :shape="item.shape" :package-name="item.packageName"/>
          </el-col> -->
        </el-row>
      </el-card>

      <!-- 设备管理 -->
      <el-card class="box-card" body-style="height: 75px;">
        <div slot="header">
          <span>设备操作</span>
        </div>
        <el-row>
          <el-col>
            <adb-btn text="设备截屏" cmdFn="_screenCap" :params="{outputPath: AppConfig.outputPath}"/>
            <adb-btn text="获取包名" cmdFn="_getAppInfo" @adbcallback="showAppInfo"/>
            <adb-btn text="设备root" cmdFn="_rootDevice"/>
            <adb-btn text="所有应用" cmdFn="_showLaunch"/>
            <adb-btn text="投屏" cmdFn="_startScrcpy" :params="{windowSetting: Mirror, outputPath: AppConfig.outputPath}"/>
          </el-col>
        </el-row>
      </el-card>
    </el-main>

    <!-- 抽屉：设备设置和小程序设置的内容 -->
    <el-drawer  :title="drawerTitle"  :visible.sync="showDrawer" size="90%"  direction="btt" >
      <div style="padding: 0 10px; height: 100%;">
        <device-list v-if="drawerTitle === '设备管理'"/>
        <weapp-list v-else-if="drawerTitle === '小程序管理'"/>
        <device-operation v-else-if="drawerTitle === '设备操作'"/>
        <app-list v-else-if="drawerTitle === '应用管理'"/>
      </div>
      
    </el-drawer>


    <el-dialog  title="应用信息"  :visible.sync="showAppInfoDialog"  width="60%">
      <p>{{currentAppInfo}}</p>
    </el-dialog>
  </el-container>
  
</template>

<script>
import DeviceList from '../components/DeviceList.vue'
import WeappList from '../components/WeappList.vue'
import DeviceOperation from '../components/DeviceOperation.vue'
import AppList from '../components/AppList.vue'
import DeviceApp from '../components/DeviceApp.vue'
import AdbBtn from '../components/adb-btn.vue'
import WeappCompileBtn from '../components/WeappCompileBtn.vue'
import DragPushToDevice from '../components/dragPushToDevice.vue'

import { mapState } from 'vuex'

export default {
  name: 'landing-page',
  components: {
    DeviceList,
    WeappList,
    DeviceOperation,
    AppList,
    DeviceApp,
    AdbBtn,
    WeappCompileBtn,
    DragPushToDevice
  },
  data () {
    return {
      selectedWeappIndex: '',
      pushDirectionIndex: '',
      drawerTitle: '设置',
      showDrawer: false,
      showAppInfoDialog: false,
      currentAppInfo: [],
      loadingEvent: {done: true, message: ''}
    }
  },
  computed: {
    ...mapState({
      AppConfig: state => state.AppConfig,
      localDeviceList: state => state.Device.localDeviceList,
      selectedDevice: state => state.Device.selectedDevice,
      weappList: state => state.Weapp.weappList,
      Mirror: state => state.Mirror,
      appList: state => state.DeviceAppList.appList,
      selectedWeapp: state => state.Weapp.selectedWeapp,
      aimDirection: state => state.Weapp.aimDirection
    }),
    // 连接的设备提示信息
    title () {
      if (this.localDeviceList.length === 0) {
        return '当前没有连接任何设备'
      }
      if (this.localDeviceList.length > 0 && this.selectedDevice) {
        return `当前操作设备：${this.selectedDevice.owner}-${this.selectedDevice.deviceId}`
      }
      if (this.localDeviceList.length > 0 && !this.selectedDevice) {
        return `请选择要操作的设备`
      }
    },
    // 选择的小程序的提示信息
    weappTitle () {
      if (this.selectedWeappIndex !== '') {
        this.$store.commit('setSelectedWeapp', {selectedWeapp: this.weappCompileList[this.selectedWeappIndex]})
      } else {
        this.$store.commit('setSelectedWeapp', {selectedWeapp: null})
      }
      if (this.pushDirectionIndex !== '') {
        let aimDirection = this.pushDirectionIndex === 0 ? {name: '本地调试包', appName: 'debug'} : this.weappList[this.pushDirectionIndex - 1]
        this.$store.commit('setAimDirection', {aimDirection})
      } else {
        this.$store.commit('setAimDirection', {aimDirection: null})
      }

      switch (true) {
        case this.selectedWeappIndex !== '' && this.pushDirectionIndex !== '':
          return `将编译“${this.selectedWeapp.name}”,并push到车机“${this.aimDirection.name}”目录下`
        case this.selectedWeappIndex === '' && this.pushDirectionIndex !== '':
          return `将使用自有小程序包并push到车机“${this.aimDirection.name}”目录下`
        case this.selectedWeappIndex !== '' && this.pushDirectionIndex === '':
          return `将只编译“${this.selectedWeapp.name}”小程序包`
        case this.selectedWeappIndex === '' && this.pushDirectionIndex === '':
          return ''
      }
    },
    weappCompileList () {
      return this.weappList.filter(item => item.path !== '')
    }
  },
  mounted () {
    // process.execPath 应用安装路径
    // process.cwd()应用安装目录
    // console.log(process.execPath)
    // alert(process.cwd())
  },
  methods: {
    // 打开相关配置页
    openConfig (name) {
      switch (name) {
        case 'device': this.drawerTitle = '设备管理'; break
        case 'weapp': this.drawerTitle = '小程序管理'; break
        case 'deviceOperation': this.drawerTitle = '设备操作'; break
        case 'appList': this.drawerTitle = '应用管理'; break
      }
      this.showDrawer = true
    },
    // 跳转应用配置页
    toConfigPage () {
      this.$router.push('/Config')
    },
    // 显示当前app信息
    showAppInfo (e) {
      this.currentAppInfo = e.message
      this.showAppInfoDialog = true
    },
    weappCompileCallback (event) {
      this.loadingEvent = event
      if (event.done) {
        if (event.type === 'success') {
          this.$message({type: 'success', message: event.message})
        } else {
          this.$message.error(event.message)
        }
      }
    }
  }
}
</script>

<style scoped>
  .container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title{
    width: 100%;
    height: 40px;
    padding: 0 16px;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f9eb;
    color: #67C23A;
  }
  .card{
    width: 100%;
    padding: 20px;
    border-radius: 8px;
    background: #eee;
  }
  .box-card{
    width: 100%;
    margin-bottom: 10px;
  }
  .card-header{
    height: 20px;
  }
  .area-draginto{
    width: 100%;
    height: 100px;
    border-radius: 6px;
    border: 1px dash #DCDFE6;
    background: #EBEEF5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #C0C4CC;
    font-size: 14px;
  }
  #el-drawer__header{
    margin-bottom: 0!important;
  }
</style>
