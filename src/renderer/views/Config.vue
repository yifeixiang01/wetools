<template>
  <div>
    <el-form ref="AppConfig" label-position="left" label-width="120px" :rules="rules" :model="AppConfig">
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="AppConfig.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <!-- <el-form-item label="开发工具路径" prop="wechatDevtoolsPath">
        <el-input v-model="AppConfig.wechatDevtoolsPath" placeholder="微信开发工具安装的路径"></el-input>
      </el-form-item>
      <el-form-item label="编译存储路径" prop="weappCompilePath">
        <el-input v-model="AppConfig.weappCompilePath" placeholder="小程序编译后的存储路径"></el-input>
      </el-form-item> -->
      <el-form-item label="文件输出路径" prop="outputPath">
        <el-input v-model="AppConfig.outputPath" placeholder="截图、录屏、小程序包等文件输出目录"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('AppConfig')">保存</el-button>
      </el-form-item>
    </el-form>  
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import Store from 'electron-store'
const store = new Store()
const fs = require('fs')
export default {
  name: 'Config',
  data () {
    return {
      AppConfig: store.get('AppConfig') || {},
      rules: {
        userName: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入用户名称'))
              } else {
                callback()
              }
            },
            trigger: 'blur'}
        ],
        // wechatDevtoolsPath: [
        //   { trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (value === '') {
        //         return callback(new Error('请输入微信开发工具路径'))
        //       } else if (!fs.existsSync(`${value}/cli.bat`)) {
        //         return callback(new Error('请输入正确的微信开发工具路径'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // ],
        // weappCompilePath: [
        //   { trigger: 'blur',
        //     validator: function (rule, value, callback) {
        //       console.log(value, fs.existsSync(value), value.indexOf('Applet') > 0)
        //       if (value === '') {
        //         return callback(new Error('请输入小程序编译存储路径'))
        //       } else if (!(fs.existsSync(`${value}`) && value.indexOf('Applet') > 0)) {
        //         return callback(new Error('请输入正确的小程序编译存储路径'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // ],
        outputPath: [
          { trigger: 'blur',
            validator: function (rule, value, callback) {
              if (value === '') {
                return callback(new Error('请输入文件输出路径'))
              } else if (!fs.existsSync(`${value}`)) {
                return callback(new Error('请输入正确的输出路径'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  created () {
    console.log(this.$store)
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.commit('setConfig', this.AppConfig)
          this.$message({message: '保存成功!', type: 'success'})
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>
<style scoped>

</style>