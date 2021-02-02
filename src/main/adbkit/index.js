const adb = require('adbkit')

// import adb from 'adbkit'
// const adb = require('adbkit')
const client = adb.createClient()
const onDevices = ({ onadd, onremove, onend }) => {
  client.trackDevices()
    .then(function (tracker) {
      tracker.on('add', function (device) {
        client.listDevicesWithPaths().then(function (list) {
          console.log(list)
          onadd && onadd({ device, list })
        })
      })
      tracker.on('remove', function (device) {
        client.listDevicesWithPaths().then(function (list) {
          onremove && onremove({ device, list })
        })
      })
      tracker.on('end', function () {
        onend && onend()
      })
    })
    .catch(function (err) {
      console.log(err)
    })
}

const connect = ({ sender }, args) => {
  const { id, ip } = args
  const success = 'Successfully opened wireless connection'
  const fail = 'Failed to open wireless connection'
  if (id) {
    client.tcpip(id)
      .then(function (port) {
        client.connect(ip, port).then(function (err) {
          if (err) {
            sender.send('connect', { success: false, message: fail })
            return
          }
          sender.send('connect', { success: true, message: success })
        }).catch(() => {
          sender.send('connect', { success: false, message: fail })
        })
      }).catch(() => {
        client.connect(ip).then(function (err) {
          if (err) {
            sender.send('connect', { success: false, message: fail })
            return
          }
          sender.send('connect', { success: true, message: success })
        }).catch(() => {
          sender.send('connect', { success: false, message: fail })
        })
      })
  } else {
    client.connect(ip).then(function (err) {
      if (err) {
        sender.send('connect', { success: false, message: fail })
        return
      }
      sender.send('connect', { success: true, message: success })
    }).catch(() => {
      sender.send('connect', { success: false, message: fail })
    })
  }
}

let port = 5556
const tcpip = (serial) => {
  client.tcpip(serial, port)
    .then(res => {
      console.log('tcpip连接', res)
    }).catch(err => {
      console.log('tcpip连接出错', err)
    })
}
let server = null
// usb转tcp代理
const usbDeviceToTcp = function (serial, port) {
  return new Promise((resolve, reject) => {
    console.log('usb转tcp代理', port)

    server = client.createTcpUsbBridge(serial, {
      auth: function () {
        return Promise.resolve()
      }
    }).listen(port)
    // console.log(server)
    server.on('listening', () => {
      // console.log('success')
      resolve()
    })
    server.on('error', (err) => {
      console.log('error ======', err.message)
      reject(err.message)
    })
    server.on('close', res => {
      console.log('server close', res)
    })
    server.on('end', res => {
      console.log('server end', res)
    })
  })
}

// 端口映射
function shareDevice (serial, hostIP, callback) {
  usbDeviceToTcp(serial, port).then(() => {
    console.log(hostIP)
    // execSync(`adb start-server ${hostIP}:${serial}`)
    console.log('success++++++++', port)
    callback && callback(port)
  }).catch((err) => {
    if (err.indexOf('EADDRINUSE') > -1) {
      console.log(`端口${port}被占用，将使用端口${port + 1}`)
      port++
      return shareDevice(serial, port, callback)
    }
  })
}

export default {
  connect, onDevices, tcpip, usbDeviceToTcp, shareDevice
}
