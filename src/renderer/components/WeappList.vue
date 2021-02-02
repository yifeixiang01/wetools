<template>
  <div>
    <el-table  :data="weappList" height="480" style="width: 100%">
      <el-table-column  label="中文名" width="100" prop="name"></el-table-column>
      <el-table-column  label="英文名" width="120" prop="appName"></el-table-column>
      <el-table-column  label="项目路径"  prop="path"></el-table-column>
      <el-table-column width="150" align="right">
        <template slot="header">
          <el-button type="primary" size="mini"  @click="addWeapp()">添加</el-button>
        </template>
        <template slot-scope="scope">
          <el-button  size="mini"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button  size="mini"  type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改、添加对话框 -->
    <el-dialog :title="dialogTitle" width="70%" :modal="false" :visible.sync="dialogShow">
      <el-form ref="newWeapp" :model="newWeapp" :rules="rules" label-position="left">
        <el-form-item label="中文名" prop="name">
          <el-input v-model="newWeapp.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="appName">
          <el-input v-model="newWeapp.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目路径" prop="path">
          <el-input v-model="newWeapp.path" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel('newWeapp')">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm('newWeapp')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Store from 'electron-store'
const fs = require('fs')
const store = new Store()
export default {
  name: 'WeappList',
  data () {
    return {
      weappList: store.get('weappList') || [],
      newWeapp: {
        name: '',
        appName: '',
        path: ''
      },
      rules: {
        name: [
          {trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入小程序名称'))
              } else {
                callback()
              }
            }
          }
        ],
        appName: [
          {trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入小程序英文名'))
              } else {
                callback()
              }
            }
          }
        ],
        path: [
          {trigger: 'blur',
            validator: (rule, value, callback) => {
              console.log(value)
              if (value === '') {
                // callback(new Error('请输入小程序项目路径'))
                callback()
              } else if (!(fs.existsSync(`${value}/project.config.json`) && value.indexOf())) {
                callback(new Error('请输入正确的项目路径'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      dialogShow: false,
      dialogTitle: '',
      editIndex: ''
    }
  },
  created () {

  },
  methods: {
    // 添加小程序
    addWeapp () {
      this.dialogTitle = '添加小程序'
      this.dialogShow = true
      this.newWeapp = {name: '', appName: '', path: ''}
    },
    // 编辑小程序
    handleEdit (index, row) {
      this.dialogTitle = '修改小程序'
      this.newWeapp = JSON.parse(JSON.stringify(row))
      this.editIndex = index
      this.dialogShow = true
    },
    // 删除小程序
    handleDelete (index, row) {
      this.weappList.splice(index, 1)
      this.$store.commit('setWeappList', {weappList: this.weappList})
    },
    // 对话框 取消
    dialogCancel (formName) {
      this.$refs[formName].resetFields()
      this.dialogShow = false
    },
    // 对话框 确认
    dialogConfirm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newWeapp = JSON.parse(JSON.stringify(this.newWeapp))
          if (this.editIndex === '') { // 添加小程序
            this.weappList.push(newWeapp)
          } else if (this.editIndex !== '') { // 修改小程序
            console.log('修改', this.editIndex, newWeapp)
            let index = this.editIndex
            this.weappList[index].name = newWeapp.name
            this.weappList[index].appName = newWeapp.appName
            this.weappList[index].path = newWeapp.path
          }
          this.editIndex = ''
          this.dialogShow = false
          this.$refs[formName].resetFields()
          this.$store.commit('setWeappList', {weappList: this.weappList})
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