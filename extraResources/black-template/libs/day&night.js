import {lightColor,darkColor} from '../utils/constants'

import base from "./base"
const cutThemeData = {
  debugNumber: 0,
  isInited:false
}

/* 初始化主题 */
function initializeTheme () {
  if(cutThemeData.isInited)return;
  cutThemeData.isInited = true;
  if (wx.hasOwnProperty('getColorStyle')) /* 支持黑白模式 */ {
    console.log('getColorStyle ok')
    // 获取当前色彩
    wx.getColorStyle({
      success: function (res) {
        if (res.colorStyle == 'dark') { // 夜间模式
          cutThemeData.ThemeColor = darkColor
        } else { // 白天模式
          cutThemeData.ThemeColor = lightColor
        }
        // 主题背景
        cutThemeData.ThemeBackground = res.backgroundColor
        // 主题背景RGB
        cutThemeData.ThemeBackgroundRGB =color2Rgb(res.backgroundColor)
        // 主题模式
        cutThemeData.ThemePattern = res.colorStyle
        // 监听变量
        watchThemePattern(cutThemeData, 'ThemePattern', setThemeBackground)
      },
      fail: function (err) {
        cutThemeData.ThemeColor = darkColor
        cutThemeData.ThemeBackground = darkColor.backgroundColor
        // 主题背景RGB
        cutThemeData.ThemeBackgroundRGB =color2Rgb(darkColor.backgroundColor)
        // 主题模式
        cutThemeData.ThemePattern = 'dark'
        // 监听变量
        watchThemePattern(cutThemeData, 'ThemePattern', setThemeBackground)
      }
    })
    // 监听主题改变api
    wx.onColorStyleChange((res) => {
      if (res.colorStyle == 'dark') { // 夜间模式
        cutThemeData.ThemeColor = darkColor
      } else { // 白天模式
        cutThemeData.ThemeColor = lightColor
      }
      // 主题背景
      cutThemeData.ThemeBackground = res.backgroundColor
      // 主题背景RGB
      cutThemeData.ThemeBackgroundRGB =color2Rgb(res.backgroundColor)
      cutThemeData.ThemeColor.backgroundColor = res.backgroundColor
      // 主题模式
      cutThemeData.ThemePattern = res.colorStyle
    })
  } else /* 不支持黑白模式 */ {
    console.log('getColorStyle no')
    cutThemeData.ThemeColor = darkColor
    cutThemeData.ThemeBackground = darkColor.backgroundColor
    // 主题背景RGB
    cutThemeData.ThemeBackgroundRGB =color2Rgb(darkColor.backgroundColor)
    // 主题模式
    cutThemeData.ThemePattern = 'dark'
    setThemeBackground();
    // 监听变量
    watchThemePattern(cutThemeData, 'ThemePattern', setThemeBackground)
  }
}

// 监听主题模式（ThemePattern）改变
function watchThemePattern (obj, key, callback) {
  let newObj = cutThemeData.ThemePattern
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set: function (value) { // 设置属性值的时候触发
      // console.log(value, "设置属性值")
      newObj = value
      callback() // 回调函数
    },
    get: function () { // 获取属性值的时候触发
      // console.log("获取属性值")
      return newObj
    }
  })
}

// 页面设置主题颜色
function setThemeBackground () {
  if(typeof getCurrentPages !== 'undefined'){
    let temp = getCurrentPages();
    if(temp && temp.length>0){
      for (let index = 0; index < temp.length; index++) {
        temp[index].setData({
          vehicleBackground: cutThemeData.ThemeBackground, // 背景颜色
          vehicleBackgroundRGB: color2Rgb(cutThemeData.ThemeBackground),
          vehicleColor: cutThemeData.ThemeColor, // 字体颜色
          colorStyle: cutThemeData.ThemePattern // 模式
        });
      }
    }
    //组件内部颜色变化
    for (let index = 0; index < base.components.length; index++) {
      base.components[index]&& base.components[index].setData && base.components[index].setData({
        vehicleBackground: cutThemeData.ThemeBackground, // 背景颜色
        vehicleBackgroundRGB: color2Rgb(cutThemeData.ThemeBackground),
        vehicleColor: cutThemeData.ThemeColor, // 字体颜色
        colorStyle: cutThemeData.ThemePattern // 模式
      });
    }
  }
}
//16进制的颜色值转换为rgb 如：#f00 -> '255,0,0'
function color2Rgb (color) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  var color = color.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    return colorChange.join(",");
  } else {
    return color;
  }
}
/* 调试 */
function debug () {
  cutThemeData.debugNumber++;
  if (cutThemeData.debugNumber % 2 == 0) {
    console.log('dark')
    cutThemeData.ThemeColor = darkColor
    // 主题背景
    cutThemeData.ThemeBackground = darkColor.backgroundColor
    // 主题背景RGB
    cutThemeData.ThemeBackgroundRGB = color2Rgb(darkColor.backgroundColor) 
    // 主题模式
    cutThemeData.ThemePattern = 'dark'
  } else {
    console.log('light')
    cutThemeData.ThemeColor = lightColor
    // 主题背景
    cutThemeData.ThemeBackground = lightColor.backgroundColor
    // 主题背景RGB
    cutThemeData.ThemeBackgroundRGB = color2Rgb(lightColor.backgroundColor) 
    // 主题模式
    cutThemeData.ThemePattern = 'light'
  }
}

export default {
  initializeTheme,
  cutThemeData,
  debug
}
//todo:用车机宽高比来做适配，media查询比例 