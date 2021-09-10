<template>
  <el-container>
    <el-main v-if="weappPath">
      <el-row :gutter="20" class="weapp-name">
        <el-col :span="8">
          <el-button type="text" size="medium">{{weappNameZh}}</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="text" size="medium">{{weappName}}</el-button>
        </el-col>
      </el-row>
      <el-card class="box-card" height="300px">
        <div slot="header" class="clearfix">
          <span>组件列表</span>
        </div>
        <div class="module-list">
          <div  class="module-item"  v-for="(module, index) in repoModules"  :key="module.name"  @contextmenu="mouseRight(index)">
              <div  class="module-name">
                {{ module.name }} <el-tooltip class="item" effect="dark" :open-delay="1000" content="点击更新此模块" placement="top-start"><i class="el-icon-refresh refresh-icon" v-if="proModules[index].selected && module.logs[0].version > proModules[index].logs[0].version" @click="updateModule(index)"></i></el-tooltip>
              </div>
              <div class="module-des">{{ module.description }}</div>
              <el-tooltip class="item" effect="dark" content="点击删除项目中的这个模块" :open-delay="1000" placement="top-start" v-if="proModules[index].selected">
                <div  :class="['el-icon-delete',  'delete-icon']" @click="deleteModule(index)"></div>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加此模块到项目中" :open-delay="1000" placement="top-start" v-else>
                <div :class="['el-icon-circle-plus-outline',  'select-icon']" @click="addModules(index)"></div>
              </el-tooltip>
            </div>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 20px;">
        <div slot="header" class="clearfix">
          <span>配置信息</span>
          <el-button style="float: right; padding: 3px 0" type="text">确认信息</el-button>
        </div>
        <div class="config-info">
          
        </div>
      </el-card>
    </el-main>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <view v-for="(log, index) in logs" :key="index">更新时间：{{ log.time }}</view>
      <el-table :data="logs">
        <el-table-column  property="mender"  label="修改人"  width="100"></el-table-column>
        <el-table-column property="update" label="更新内容"></el-table-column>
        <el-table-column  property="version"  label="版本号"  width="100"></el-table-column>
        <el-table-column  property="time"  label="更新日期"  width="150"></el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>
<script>
import tools from '../../main/tools/index'
import { mapState } from 'vuex'
import fs from 'fs'
const rimraf = require('rimraf')
const path = require('path')

export default {
  data () {
    return {
      proModules: [],
      weappName: '',
      weappNameZh: '',
      dialogVisible: false,
      logs: [],
      title: '更新日志',
      showLoading: false

    }
  },
  computed: {
    ...mapState({
      weappPath: function (state) {
        let path = state.WeappProject.cutWeappProPath
        this.getConfigData(path)
        return path
      },
      repoModules: function (state) { // 代码库模块配置有更新，重新校验本地配置
        return state.WeappProject.modules
      }
    })
  },
  watch: {

  },
  mounted () {
    // 获取代码库配置信息
    this.$store.commit('getModules')

    this.getConfigData(this.weappPath)
  },
  methods: {
    // 获取项目配置信息
    getConfigData (weappPath) {
      if (weappPath) {
        // 获取当前小程序模块配置
        let packagePath = path.join(weappPath, 'package.json')
        let packageData = fs.readFileSync(packagePath, 'utf8')
        let {weappName, weappNameZh, modules} = JSON.parse(packageData)
        this.proModules = modules
        this.weappName = weappName
        this.weappNameZh = weappNameZh
      }
    },
    // 导入项目之前，先检测package.json文件和项目中实际模块是否一致
    checkModules () {

    },
    // 鼠标右键模块，显示更新日志
    mouseRight (index) {
      this.dialogVisible = true
      this.title = `更新日志 ${this.repoModules[index].name}`
      this.logs = this.repoModules[index].logs
    },
    // 删除模块
    deleteModule (index) {
      let module = this.repoModules[index]
      // 模块路径
      let modulePath = path.join(this.weappPath, module.path, module.name)
      console.log('删除模块', module, modulePath)
      rimraf.sync(modulePath, {})
      this.modifyPackage('delete', index)
      this.changePackage('delete', index)
      this.$message({
        message: `模块${module.name}已删除！`,
        type: 'success'
      })
    },
    // 添加模块
    addModules (index) {
      console.log('添加模块')
      let module = this.repoModules[index]
      // 本地存放的远程库路径
      let repoPath = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'extraResources/templates' : '/resources/extraResources/templates')

      let srcPath = path.join(repoPath, module.path, module.name)
      let tarPath = path.join(this.weappPath, module.path, module.name)
      fs.mkdirSync(tarPath)

      tools.copyFolder(srcPath, tarPath, () => {
        this.modifyPackage('add', index)
        this.changePackage('add', index)
        this.$message({
          message: `模块${module.name}添加成功！`,
          type: 'success'
        })
      })
    },
    // 更新模块
    updateModule (index) {
      let module = this.repoModules[index]
      // 本地存放的远程库路径
      let repoPath = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'extraResources/templates' : '/resources/extraResources/templates')
      // 项目中模块路径
      let modulePath = path.join(this.weappPath, module.path, module.name)
      // 先删除项目中的模块
      rimraf.sync(modulePath, {})

      // 再copy仓库中的模块到项目中
      let srcPath = path.join(repoPath, module.path, module.name)
      let tarPath = path.join(this.weappPath, module.path, module.name)
      fs.mkdirSync(tarPath)

      tools.copyFolder(srcPath, tarPath, () => {
        this.modifyPackage('update', index)
        this.changePackage('update', index)
        this.$message({
          message: `模块${module.name}已更新！`,
          type: 'success'
        })
      })
    },
    // 修改项目中package.json文件内容
    modifyPackage (type, index) {
      // 本地配置
      let packagePath = path.join(this.weappPath, 'package.json')
      let packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

      packageData.modules.forEach(module => {
        if (module.name === this.repoModules[index].name) {
          switch (type) {
            case 'add': module.selected = true; break
            case 'delete': module.selected = false; break
            case 'update': module.logs = this.repoModules[index].logs
          }
        }
      })

      fs.writeFileSync(packagePath, JSON.stringify(packageData))
    },
    // 修改proModules
    changePackage (type, index) {
      switch (type) {
        case 'add': this.$set(this.proModules[index], 'selected', true); break
        case 'delete': this.$set(this.proModules[index], 'selected', false); break
        case 'update': this.$set(this.proModules[index], 'logs', this.repoModules[index].logs); break
      }
    }
  }

}
</script>

<style scoped>
.weapp-name{
  width: 60%;
  height: 38px;
  position: fixed;
  top: 0;
  left: 20%;
  border-radius: 8px;
  background: #DCDFE6;
  color: #303133;
  font-size: 26px;
}
.module-list{
  width: 100%;
  height: 170px;
  overflow-y: auto;
}
.module-item {
  width: 50%;
  height: 50px;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  cursor: pointer;
}
.module-name {
  font-size: 16px;
  line-height: 1.5;
  color: #409eff;
  user-select: none;
}
.module-des {
  font-size: 12px;
  line-height: 1.7;
  color: #909399;
}
.select-icon {
  width: 20px;
  height: 20px;
  color: #409eff;
  font-size: 20px;
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
}

.delete-icon{
  width: 20px;
  height: 20px;
  color: #F56C6C;
  font-size: 20px;
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
}
.refresh-icon{
  width: 20px;
  height: 20px;
  margin-left: 20px;
  font-size: 20px;
  cursor: pointer;
}
/* 配置信息 */
.config-info{
  height: 200px;
  overflow-y: auto;
}
</style>