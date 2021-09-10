<template>
  <el-container>
    <el-main >
      <el-row>
        <el-col :span="6">
          <el-image
            src="http://p1-q.mafengwo.net/s5/M00/AA/29/wKgB3FFuA-WAPGT2AAPAgyU8kMk07.jpeg"
            class="image"
          ></el-image>
        </el-col>
        <el-col :span="14">
          <div class="title">小程序自定义</div>
          <div class="title-des">可自定选择模块以创建新的项目</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="text" icon="el-icon-folder-opened" @click="selectProDir">项目位置</el-button>
          <el-input  placeholder="请输入项目存放的位置"  v-model="projectDir"  size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="text" icon="el-icon-document">小程序英文名</el-button>
          <el-input  placeholder="请输入小程序英文名"  size="small"  v-model="weappName"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="text" icon="el-icon-tickets">小程序名称</el-button>
          <el-input placeholder="请输入小程序名称"  size="small"  v-model="weappNameZh"></el-input>
        </el-col>
      </el-row>
      <el-card class="box-card" height="300px" style="margin: 20px 0;">
        <div slot="header" class="clearfix">
          <span>组件列表</span>
        </div>
        <div class="module-list">
          <div  class="module-item"  v-for="(module, index) in repoModules"  :key="module.name"  @contextmenu="mouseRight(index)"   @click="selectModule(index)">
              <div  class="module-name">
                {{ module.name }}
              </div>
              <div class="module-des">{{ module.description }}</div>
              <div :class="['el-icon-success',  'select-icon',  module.selected ? 'selected' : '',]"></div>
            </div>
        </div>
      </el-card>
      <el-row type="flex" justify="center" v-if="repoModules.length > 0">
        <el-button type="primary" @click="createProject">开始创建</el-button>
      </el-row>
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
const fs = require('fs')
const path = require('path')
const {dialog} = require('electron').remote

export default {
  data () {
    return {
      repoModules: [],
      projectDir: '',
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
      modules: function (state) {
        return state.WeappProject.modules
      }
    })

  },
  watch: {
    modules (val) {
      this.repoModules = JSON.parse(JSON.stringify(val))
    }
  },
  mounted () {
    // 获取代码库配置信息
    this.$store.commit('getModules')
  },
  methods: {
    formateModules: (modules) => {
      console.log('格式化代码库模块列表', modules)
      let arr = []
      let len = modules.length
      let lineLen = len % 8 === 0 ? len / 4 : Math.floor(len / 4 + 1)
      modules.map(module => {
        module.selected = false
      })
      if (len > 0) {
        for (let i = 0; i < lineLen; i += 8) {
          let temp = modules.slice(i * 8, i * 8 + 8)
          arr.push(temp)
        }
      }

      return arr
    },
    // 打开对话框选择文件夹目录
    selectProDir () {
      dialog.showOpenDialog({properties: ['openDirectory']}, (result) => {
        if (result) {
          this.projectDir = result[0]
        }
      })
    },
    // 选择/取消模块
    selectModule (index) {
      this.$set(this.repoModules[index], 'selected', !this.repoModules[index].selected)
    },
    // 鼠标右键模块，显示更新日志
    mouseRight (index) {
      this.dialogVisible = true
      this.title = `更新日志 ${this.repoModules[index].name}`
      this.logs = this.repoModules[index].logs
    },
    // 创建项目
    createProject () {
      let selectedModules = []
      this.repoModules.forEach((item) => {
        if (item.selected) {
          selectedModules.push(item)
        }
      })

      // 空白模板文件夹路径
      let templatePath = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'extraResources/black-template' : '/resources/extraResources/black-template')

      if (this.projectDir && this.weappName && this.weappNameZh) {
        let projectPath = path.join(this.projectDir, this.weappName)
        // 先创建项目目录，再拷贝空白模板，之后拷贝选择的模块文件
        fs.mkdirSync(projectPath)
        tools.copyFolder(templatePath, projectPath, () => {
          console.log('---------模板拷贝完成-----------')

          let repoPath = path.join(process.cwd(), process.env.NODE_ENV === 'development' ? 'extraResources/templates' : '/resources/extraResources/templates')
          // 修改package文件
          this.changePackage(repoPath, projectPath, selectedModules)

          // 拷贝选择的模块

          this.copyModules(repoPath, projectPath, selectedModules)

          // 修改project.config.json文件
          this.changeProConfig(projectPath)
          // 修改constants文件
          this.changeConstant(projectPath)
        })
      }
    },
    // copy选择的模块
    copyModules  (srcPath, tarPath, selectedModules) {
      console.log('开始拷贝模块', selectedModules)
      // let tarAppJsonPath = path.join(tarPath, 'app.json')
      // let tarAppJsonData = JSON.parse(fs.readFileSync(tarAppJsonPath, 'utf8'))

      selectedModules.forEach(module => {
        let modulePath = path.join(srcPath, module.path, module.name)
        console.log('模块路径', modulePath)
        let target = path.join(tarPath, module.path, module.name)
        fs.mkdirSync(target)
        tools.copyFolder(modulePath, target, () => {
          console.log(`拷贝${module.name}完成`)
        })

        // if (module.pages) {
        //   console.log('----在app.json中添加页面路径', module.pages)
        //   tarAppJsonData.pages = tarAppJsonData.pages.concat(module.pages)
        // }
      })

      // 修改app.json文件中的pages
      // fs.writeFileSync(tarAppJsonPath, JSON.stringify(tarAppJsonData))

      this.$message({
        message: '项目创建完成！',
        type: 'success'
      })
      setTimeout(() => {
        this.$store.commit('changeCutWeappPro', {cutWeappProPath: tarPath})
        this.$router.replace({name: 'WeappProject'})
      }, 500)
    },
    // 修改package文件中添加的模块和小程序名字
    changePackage (srcPath, tarPath, selectedmodules) {
      console.log('修改package.json')
      let tarPackagePath = path.join(tarPath, 'package.json')
      let srcPackagePath = path.join(srcPath, 'package.json')
      let srcPackageData = JSON.parse(fs.readFileSync(srcPackagePath, 'utf8'))
      console.log(srcPackageData)
      // 修改package文件中的模块为选择的模块
      srcPackageData.modules.forEach(proModule => {
        proModule.selected = false
        selectedmodules.forEach(module => {
          if (proModule.name === module.name) {
            proModule.selected = true
          }
        })
      })

      // 修改package中的项目名
      srcPackageData.weappName = this.weappName
      srcPackageData.weappNameZh = this.weappNameZh

      fs.writeFileSync(tarPackagePath, JSON.stringify(srcPackageData), 'utf8')
    },
    // 修改project.config.json文件中的小程序名字
    changeProConfig (tarPath) {
      let filePath = path.join(tarPath, 'project.config.json')
      let fileData = fs.readFileSync(filePath, 'utf8')
      let data = fileData.replace('<weappNameZh>', this.weappNameZh).replace('<weappName>', this.weappName)
      fs.writeFileSync(filePath, data)
    },
    // 修改project.config.json文件中的小程序名字
    changeConstant (tarPath) {
      console.log('修改constants文件')
      let filePath = path.join(tarPath, 'utils/constants.js')
      let fileData = fs.readFileSync(filePath, 'utf8')
      let data = fileData.replace('<weappNameZh>', this.weappNameZh).replace('<weappName>', this.weappName)
      fs.writeFileSync(filePath, data)
      console.log('constant', data)
      let appPath = path.join(tarPath, 'app.js')
      let appData = fs.readFileSync(appPath, 'utf8')
      fs.writeFileSync(appPath, appData.replace('<weappNameZh>', this.weappNameZh))
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
.module-list{
  width: 100%;
  height: 250px;
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
