
const { exec, spawn } = require('child_process')
const os = require('os')
const fs = require('fs')
let cwd = process.cwd() + ((process.env.NODE_ENV === 'development') ? '/extraResources/weapp-compile' : '/resources/extraResources/weapp-compile')

function _compileWeapp2 (projectPath, aimPath) {
  return new Promise((resolve, reject) => {
    exec(`mossappcompile-win.exe ${projectPath} ${aimPath}`, {cwd}, (error, stdout, stderr) => {
      console.log('compile', error)
      console.log('stdout', stdout)
      console.log('stderr', stderr)
      if (stdout.indexOf('project.config.json not exists') !== -1) {
        reject(new Error('project.config.json not exists'))
      }
      if (stdout.indexOf('编译成功') !== -1) {
        resolve()
      }
    })
  })
}
function _renameFile (oldPath, newPath) {
  fs.renameSync(oldPath, newPath)
  return Promise.resolve()
}
/**
 * 将小程序进行编译，并生成.wxapkg文件
 * @param {*} weappName 小程序中文名
 * @param {*} projectPath 小程序项目路径
 * @param {*} weappCompilePath 小程序编译后的小程序包存放目录
 * @param {*} wechatDevtoolsPath 小程序开发工具的目录
 */
function _compileWeapp (weappName, projectPath, weappCompilePath, wechatDevtoolsPath) {
  return new Promise((resolve, reject) => {
    console.log(`开始编译“${weappName}”小程序`)
    let timer = null
    let workerProcess = exec(`cli auto-preview --project ${projectPath}`, {cwd: wechatDevtoolsPath}, (error, stdout, stderr) => {
      if (error) {
        console.log('+++error', error)
      }
      console.log('+++stdout', stdout)
      if (stdout.indexOf(19) > -1) {
        reject(new Error('项目路径错误'))
      }
      console.log('+++stderr', stderr)
    })

    workerProcess.stdout.on('error', data => {
      console.log('stdout', data)
    })
    workerProcess.stderr.on('data', data => {
      console.log('stderr', data)
    })
    workerProcess.on('close', code => {
      console.log('编译close', code)
      if (code === 0) {
        console.log('开始监听文件变化', `${weappCompilePath}/__APP__.wxapkg`)
        fs.watch(`${weappCompilePath}/__APP__.wxapkg`, (eventType, filename) => {
          console.log('文件变化', eventType, filename)
          if (eventType === 'change') {
            clearTimeout(timer)
            timer = setTimeout(() => {
              console.log('编译完成--------')
              resolve()
            }, 300)
          }
        })
      } else {
        console.log(`编译失败,code=${code}`)
        reject(new Error(`编译失败，code=${code}`))
      }
    })
  })
}

/**
 * 在电脑上拷贝一个文件到另一个目录
 * @param {*} resourcePath 源文件路径
 * @param {*} aimPath 目标文件夹
 */
// 将_APP_.wxapkg copy到当前目录下，并修改文件名
function _copyFile (resourcePath, aimPath) {
  return new Promise((resolve, reject) => {
    console.log('------开始copy文件')
    console.log(`--源文件:${resourcePath}，目标:${aimPath}`)
    if (!fs.existsSync(resourcePath)) {
      console.log('不存在此文件', resourcePath)

      reject(new Error(`拷贝失败，不存在此文件:${resourcePath}`))
    } else {
      if (fs.existsSync(aimPath)) {
        fs.unlinkSync(aimPath)
      }
      fs.copyFile(resourcePath, aimPath, (data) => {
        console.log('--拷贝文件完成--', data)
        if (!fs.existsSync(aimPath)) {
          console.log('不存在此文件', resourcePath)

          reject(new Error(`拷贝失败，不存在此文件:${resourcePath}`))
        } else {
          resolve()
        }
      })
    }
  })
}

/**
 * 查看连接的设备信息
 */
function _getDevices () {
  return new Promise((resolve, reject) => {
    exec('adb devices -l', (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
      }
      console.log('getDevices stdout', stdout)
      if (stdout.match(/[0-9]/g)) {
        console.log('当前的设备', stdout)
        resolve(stdout)
      } else {
        reject(new Error('当前没有设备连接'))
      }
      console.log('getDevices stderr', stderr)
    })
  })
}

/**
 * 打开cmd
 */
function _startCMD () {
  var result = spawn('cmd.exe', ['/s', '/c', 'ipconfig'])
  result.on('close', function (code) {
    console.log('child process exited with code :' + code)
  })
  result.stdout.on('data', function (data) {
    console.log('stdout: ' + data)
  })
  result.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
  })
}

/**
 * 将当前时间格式化为年月日 20201206
 */
function _formateDate () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month > 9 ? month : '0' + month
  let day = date.getDate()
  day = day > 9 ? day : '0' + day
  let hour = date.getHours()
  hour = hour > 9 ? hour : '0' + hour
  let minutes = date.getMinutes()
  minutes = minutes > 9 ? minutes : '0' + minutes
  let seconds = date.getSeconds()
  seconds = seconds > 9 ? seconds : '0' + seconds
  return `${year}${month}${day}${hour}${minutes}${seconds}`
}

/**
 * 判断电脑某个程序是否在运行
 * @param {*} appName 程序名
 * @param {*} appNameZh 程序中文名
 */
function _isAppRunning (appName, appNameZh) {
  return new Promise((resolve, reject) => {
    exec(`tasklist`, (error, stdout, stderr) => {
      if (error) {
        console.log('stderr', error)
      }
      console.log('stdout', stdout)
      if (stdout.indexOf(`${appName}.exe`) !== -1) {
        console.log(`------${appName}正在运行-------`)
        resolve()
      } else {
        console.log(`------${appName}没有启动-------`)
        reject(new Error(`请先启动：${appNameZh}`))
      }
      console.log(stderr)
    })
  })
}

/**
 * 获取电脑IP地址
 */
// 获取电脑IP地址
function _getIPAddress () {
  var interfaces = os.networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

export default {
  _compileWeapp,
  _copyFile,
  _startCMD,
  _getDevices,
  _formateDate,
  _isAppRunning,
  _getIPAddress,
  _compileWeapp2,
  _renameFile
}
