import {Menu} from 'electron'
let template = [
  {
    label: '配置',
    submenu: [
      {
        label: '项目',
        click: function () {
          console.log('------点击项目')
        }
      }
    ]
  }
]

let menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
