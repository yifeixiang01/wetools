import tools from '../tools'
import {startScrcpy} from '../scrcpy'
const { exec, execSync } = require('child_process')

/**
 * 将移动设备截屏，并保存到电脑目录
 * @param {*} serial 设备序列号
 * @param {*} outputPath 保存目录
 * ToDo 截屏成功后，要删除设备上的截屏文件，文件日期格式化
 */
function _screenCap ({serial, outputPath}) {
  return new Promise(resolve => {
    let date = tools._formateDate()
    execSync(`adb -s ${serial} shell screencap -p /sdcard/screencap.png`)
    execSync(`adb -s ${serial} pull /sdcard/screencap.png ${outputPath}/screen_${date}.png`)
    resolve('截屏成功！')
  })
}

/**
 * 设备root
 * @param {*} serial 设备序列号
 */
function _rootDevice ({serial}) {
  return new Promise((resolve, reject) => {
    exec(`adb -s ${serial} root`, (error, stdout, stderr) => {
      console.log(error)
      console.log(stdout)
      if (stdout.indexOf('running as root') > -1) {
        reject(new Error('该设备已经root'))
      } else if (stdout.indexOf('cannot run as root') > -1) {
        reject(new Error('root失败！'))
      } else {
        resolve('root成功！')
      }
      console.log(stderr)
    })
  })
}

/**
 * 断开设备连接
 * @param {*} serial 设备序列号
 */
function _disconnectDevice ({serial}) {
  return new Promise(resolve => {
    execSync(`adb disconnect ${serial}`)
  })
}

/**
 * 连接设备
 * @param {*} serial 设备序列号
 */
function _connectDevice ({serial}) {
  return new Promise(resolve => {
    execSync(`adb connect ${serial}`)
  })
}

/**
 * 显示移动设备所有桌面应用
 * @param {*} serial 设备序列号
 */
function _showLaunch ({serial}) {
  return new Promise(resolve => {
    execSync(`adb -s ${serial} shell setprop sys.thirdapk.caninstall 1`)
    execSync(`adb -s ${serial} shell am force-stop com.android.launcherWT`)
  })
}

/**
 * 判断设备目录下是否存在某个文件
 * @param {*} serial 设备序列号
 * @param {*} filePath 文件路径
 */
function _isExistFileInDevice ({serial, filePath}) {
  return new Promise((resolve, reject) => {
    console.log('_+_+_+开始判断设备上文件是否存在')
    exec(`adb -s ${serial} shell find ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        console.log('error', JSON.stringify(error), typeof JSON.stringify(error))
      }
      console.log('stdout', stdout)
      if (stdout.indexOf('no devices/emulators') > -1) {
        reject(new Error('设备连接中断'))
      }
      if (stdout.indexOf('No such file or directory') > -1 || stderr.indexOf('No such file or directory') > -1) {
        reject(new Error(`设备不存在此文件或文件夹：${filePath}`))
      } else {
        console.log('---存在此文件', filePath)
        resolve()
      }
    })
  })
}

/**
 * 获取设备上正在打开的包名和activity
 * @param {*} serial 设备序列号
 * 获取包名：
 * adb shell dumpsys package <package_name>  //获取全部信息
 * adb shell dumpsys package <package_name> | grep XXX //获取XXX信息
 */
function _getAppInfo ({serial}) {
  return new Promise((resolve, reject) => {
    exec(`adb -s ${serial} shell "dumpsys window | grep mCurrentFocus"`, (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
      }
      console.log('---stdout', stdout)
      console.log('stderr', stderr)
      if (stdout.indexOf('no devices/emulators') > -1) {
        reject(new Error('设备连接中断'))
      }

      if (stdout) {
        resolve(stdout)
      }
      stdout && resolve(stdout)
      // let pattern = /(?<=u0).*?(?=\})/
    })
  })
}

/**
 * 清除移动设备上的某个应用缓存
 * @param {*} serial 设备序列号
 * @param {*} appName 应用名
 */
function _clearAppStorage ({serial, appName}) {
  console.log('清除应用缓存', `adb -s ${serial} shell pm clear ${appName}`)
  return new Promise(resolve => {
    exec(`adb -s ${serial} shell pm clear ${appName}`)
  })
}

/**
 * 关闭移动设备上的某个应用
 * @param {*} serial 设备序列号
 * @param {*} appName 应用名
 */
function _closeApp ({serial, appName}) {
  return new Promise((resolve, reject) => {
    console.log('关闭应用：' + appName)
    exec(`adb -s ${serial} shell am force-stop ${appName}`, (error, stdout, stderr) => {
      if (error) {
        console.log('error', error)
      }
      console.log('stdout', stdout)
      if (stdout.indexOf('no devices/emulators') > -1) {
        reject(new Error('设备连接中断'))
      }
      console.log('stderr', stderr)
    })
  })
}

/**
 * 将文件拷贝到移动设备
 * @param {*} filePath 文件路径
 * @param {*} aimPath 设备上目标文件路径
 * @param {*} serial 设备序列号
 */
function _pushFileToDevice ({serial, filePath, aimPath}) {
  return new Promise((resolve, reject) => {
    console.log('-----开始将文件push到车机')
    let folderPath = aimPath.slice(0, aimPath.lastIndexOf('/'))

    // 先判断设备上将要push的目录是否存在
    _isExistFileInDevice({serial, filePath: folderPath}).then(() => {
      console.log(`adb -s ${serial} push ${filePath} ${aimPath}`)
      let workerProcess = exec(`adb -s ${serial} push ${filePath} ${aimPath}`, {cwd: './'})

      workerProcess.stdout.on('data', data => {
        console.log('push stdout', data)
        if (data.indexOf('Permission denied') > -1) {
          console.log('Permission denied', data.indexOf('Permission denied'))
          reject(new Error('Permission denied: adb没有push权限'))
        }
        if (data.indexOf('no devices/emulators') > -1) {
          reject(new Error('设备连接中断，push失败'))
        }
      })
      workerProcess.stderr.on('data', data => {
        console.log('push stderr', data)
      })
      workerProcess.on('close', code => {
        console.log('push close', code)
        if (code === 0) {
          console.log('------完成push小程序包到车机')
          resolve()
        }
      })
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 打开移动设备上的某个应用
 * @param {*} serial 序列号
 * @param {*} packageName 应用名
 */
function _startApp ({serial, packageName}) {
  console.log(`adb -s ${serial} shell am start ${packageName}`)
  return new Promise((resolve, reject) => {
    exec(`adb -s ${serial} shell am start ${packageName}`, (error, stdout, stderr) => {
      if (error) {
        console.log('111111error', JSON.stringify(error))
      }
      console.log('222222stdout', stdout)
      if (stdout.indexOf('no devices/emulators') > -1) {
        reject(new Error('设备连接中断'))
      }
      if (stderr.toLowerCase().indexOf('permission denial') > -1) {
        console.log('33333Permission denied')
        reject(new Error('Permission denied'))
      } else {
        resolve()
      }
    })
  })
}

export default {
  _screenCap,
  _rootDevice,
  _disconnectDevice,
  _connectDevice,
  _showLaunch,
  _isExistFileInDevice,
  _getAppInfo,
  _clearAppStorage,
  _startApp,
  _closeApp,
  _pushFileToDevice,
  _startScrcpy: startScrcpy
}
