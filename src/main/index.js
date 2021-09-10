'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

import Store from 'electron-store'

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

const store = new Store()
console.log(store)
console.log('小程序配置', store.get('weappConfig'))
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 662,
    width: 820,
    maximizable: false,
    useContentSize: true,
    resizable: true,
    // frame: false,   //无边框
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  console.log('---------------------------------------appPath', app.getAppPath())
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()

  ipcMain.on('show-context-menu', (event) => {
    createMenu(event)
  })
})

// 顶部菜单
function createMenu (event) {
  console.log('----------------------------开始创建菜单')
  let template = [
    {
      label: '设置',
      submenu: [
        {
          label: '应用设置',
          click: function () {
            console.log('----打开应用配置')

            event.sender.send('context-menu-command', 'setConfig')
          }
        }
      ]
    },
    {
      label: '项目',
      submenu: [
        {
          label: '更新代码库',
          click: function () {
            event.sender.send('context-menu-command', 'updateRepo')
          }
        },
        {
          label: '新建小程序',
          click: function () {
            event.sender.send('context-menu-command', 'createWeapp')
          }
        },
        {
          label: '导入小程序',
          click: function () {
            console.log('------导入项目')
            event.sender.send('context-menu-command', 'importWeapp')
          }
        }
      ]
    },
    {
      label: '工具',
      submenu: [
        {
          label: '小程序工具',
          click: function () {
            event.sender.send('context-menu-command', 'wetools')
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '使用文档',
          click: function () {
            event.sender.send('context-menu-command', 'openDoc')
          }
        }
      ]
    }
  ]

  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
