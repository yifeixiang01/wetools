<template>
  <el-container v-loading.fullscreen.lock="showLoading" element-loading-text="正在拉取远程模板..."  element-loading-spinner="el-icon-loading"  element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-main >
      <el-row>
        <el-col :span="6">
          <el-image
            src="http://p1-q.mafengwo.net/s5/M00/AA/29/wKgB3FFuA-WAPGT2AAPAgyU8kMk07.jpeg"
            class="image"
          ></el-image>
        </el-col>
        <el-col :span="8">
          <div class="title">小程序自定义</div>
          <div class="title-des">可自定选择模块以创建新的项目</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="text" icon="el-icon-folder-opened"
            >项目位置</el-button
          >
          <el-input
            placeholder="请输入项目存放的位置"
            v-model="projectDir"
            size="small"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="text" icon="el-icon-tickets">小程序名称</el-button>
          <el-input
            placeholder="请输入小程序名称"
            size="small"
            v-model="weappNameZh"
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="text" icon="el-icon-document">小程序英文名</el-button>
          <el-input
            placeholder="请输入小程序英文名"
            size="small"
            v-model="weappName"
          ></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="text" icon="el-icon-setting">配置列表</el-button>
      </el-row>
      <el-carousel
        trigger="click"
        :loop="false"
        indicator-position="none"
        :autoplay="false"
        height="300px"
      >
        <el-carousel-item
          v-for="(configList, configIndex) in list"
          :key="configIndex"
        >
          <div class="swiper-item">
            <div
              class="module-item"
              v-for="(module, index) in configList"
              :key="module.name"
              @contextmenu="mouseRight(configIndex, index)"
               @click="selectModule(configIndex, index)"
            >
              <div
                class="module-name"
              >
                {{ module.name }}
              </div>
              <div class="module-des">{{ module.description }}</div>
              <div
                :class="[
                  'el-icon-success',
                  'select-icon',
                  module.selected ? 'selected' : '',
                ]"
              ></div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <el-row type="flex" justify="center" v-if="list.length > 0">
        <el-button type="primary" @click="createProject">开始创建</el-button>
      </el-row>
    </el-main>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <view v-for="(log, index) in logs" :key="index"
        >更新时间：{{ log.time }}</view
      >
      <el-table :data="logs">
        <el-table-column
          property="mender"
          label="修改人"
          width="100"
        ></el-table-column>
        <el-table-column property="update" label="更新内容"></el-table-column>
        <el-table-column
          property="version"
          label="版本号"
          width="100"
        ></el-table-column>
        <el-table-column
          property="time"
          label="更新日期"
          width="150"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </el-container>
</template>

<script>
import tools from '../../main/tools/index'
const download = require('download-git-repo')
const path = require('path')
const rimraf = require('rimraf')
const fs = require('fs')

console.log(tools)
export default {
  data () {
    return {
      list: [],
      projectDir: '',
      weappName: '',
      weappNameZh: '',
      dialogVisible: false,
      logs: [],
      title: '更新日志',
      showLoading: false
    }
  },
  created () {
    // this.getGitConfig()
    let filePath = path.join(
      process.cwd(),
      process.env.NODE_ENV === 'development'
        ? 'extraResources/templates/package.json'
        : '/resources/extraResources/templates/package.json'
    )

    this.getModuleList(filePath)
  },
  methods: {
    // 选择/取消模块
    selectModule (configIndex, index) {
      this.list[configIndex][index].selected = !this.list[configIndex][index]
        .selected
    },
    // 创建项目
    createProject () {
      let list = [].concat(...this.list)
      let selectedModules = []
      list.forEach((item) => {
        if (item.selected) {
          let tmpObj = {name: item.name, path: item.path}
          selectedModules.push(tmpObj)
        }
      })

      // 空白模板文件夹路径
      let folderPath = path.join(
        process.cwd(),
        process.env.NODE_ENV === 'development'
          ? 'extraResources/black-template'
          : '/resources/extraResources/black-template'
      )

      if (this.projectDir && this.weappName) {
        let projectPath = path.join(this.projectDir, this.weappName)
        // 先创建项目目录，再拷贝空白模板，之后拷贝选择的模块文件
        fs.mkdirSync(projectPath)
        tools.copyFolder(folderPath, projectPath, () => {
          console.log('拷贝完成')
          let templatePath = path.join(
            process.cwd(),
            process.env.NODE_ENV === 'development'
              ? 'extraResources/templates'
              : '/resources/extraResources/templates'
          )
          this.copyModules(selectedModules, templatePath, projectPath)
        })
      }
    },
    // 鼠标右键模块，显示更新日志
    mouseRight (configIndex, index) {
      console.log(configIndex, index)
      this.dialogVisible = true
      this.title = `更新日志 ${this.list[configIndex][index].name}`
      this.logs = this.list[configIndex][index].logs
    },
    // 克隆远程代码库
    getGitConfig () {
      this.showLoading = true
      let dir = path.join(
        process.cwd(),
        process.env.NODE_ENV === 'development'
          ? 'extraResources/templates'
          : '/resources/extraResources/templates'
      )
      // 下载前先保证文件夹下没有其它文件
      rimraf.sync(dir, {})
      // git clone
      download(
        'direct:http://10.1.120.4:8081/v_feixiangyi/weapp-template.git',
        dir,
        { clone: true },
        (err) => {
          this.showLoading = false
          console.log(err ? 'Error' : 'Success', err)
          let filePath = path.join(dir, 'package.json')
          if (fs.existsSync(filePath)) {
            console.log('存在package.json')
            this.$message({
              message: '模板拉取成功！',
              type: 'success'
            })
            this.getModuleList(filePath)
          } else {
            console.log('不存在package.json')
            this.$message.error('模板拉取失败！')
          }
        }
      )
    },
    // 获取模块配置内容
    getModuleList (file) {
      console.log('开始读取package.json文件内容')
      let config = fs.readFileSync(file, 'utf8')

      let moduleList = JSON.parse(config).modules
      this.formateModuleList(moduleList)
    },
    formateModuleList (list) {
      console.log('模块列表', list)
      let arr = []
      let len = list.length
      let lineLen = len % 8 === 0 ? len / 4 : Math.floor(len / 4 + 1)
      list.forEach((item) => {
        item.selected = false
      })
      for (let i = 0; i < lineLen; i += 8) {
        let temp = list.slice(i * 8, i * 8 + 8)
        arr.push(temp)
      }

      this.list = arr
    },
    copyModules  (selectedModules, srcPath, tarPath) {
      console.log('开始拷贝模块', selectedModules)

      selectedModules.forEach(module => {
        let modulePath = path.join(srcPath, module.path, module.name)
        console.log('模块路径', modulePath)
        let target = path.join(tarPath, module.path, module.name)
        fs.mkdirSync(target)
        console.log('目标文件夹', target)
        tools.copyFolder(modulePath, target, () => {
          console.log(`拷贝${module.name}完成`)
        })
      })
      // 拷贝package文件
      this.copyPackage(srcPath, tarPath)
      this.$message({
        message: '项目创建完成！',
        type: 'success'
      })
    },
    // 拷贝package文件
    copyPackage (srcPath, tarPath) {
      let srcPackageFile = path.join(srcPath, 'package.json')
      let tarPackageFile = path.join(tarPath, 'package.json')
      console.log('开始拷贝package文件', srcPackageFile, tarPackageFile)
      tools.copyFile(srcPackageFile, tarPackageFile)
      this.changeWeappName(tarPath)
    },
    changeWeappName (tarPath) {
      let packagePath = path.join(tarPath, 'project.config.json')
      let packageData = fs.readFileSync(packagePath, 'utf8')

      fs.writeFileSync(packagePath, packageData.replace('<weappNameZh>', this.weappNameZh))
    }
  }
}
</script>
<style scoped>
.image {
  width: 160px;
  height: 100px;
  border-radius: 10px;
}
.title {
  font-size: 20px;
  color: #409eff;
  font-weight: bold;
  cursor: pointer;
}
.title-des {
  color: #909399;
  font-size: 14px;
  line-height: 30px;
}
.swiper-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.module-item {
  width: 50%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  cursor: pointer;
}
.module-name {
  font-size: 18px;
  line-height: 1.5;
  color: #409eff;
  cursor: pointer;
  user-select: none;
}
.module-des {
  font-size: 12px;
  line-height: 1.7;
  color: #909399;
}
.select-icon {
  width: 26px;
  height: 26px;
  color: #909399;
  font-size: 26px;
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
}
.selected {
  color: #409eff;
}
</style>
