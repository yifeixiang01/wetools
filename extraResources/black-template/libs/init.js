//网络状态判断
import base from './base'
//taro转h5 删除下面三行
import {
    trackInfo
} from '../utils/constants'
import Tracker from "./collect.min";
// import Tracker from "./track/index"
import trackConfig from '../tracks/main.js';
import dayNight from "./day&night"
import {
    getPageOfCurrent
} from './utils';
//目前在203EV车机上实验，启动小程序会触发一次监听事件
//devTools上启动时不会触发
//可以使用res.isConnected来判断网络是否连接
wx.onNetworkStatusChange(function (res) {
    if (typeof getCurrentPages !== 'undefined') {
        let temp = getCurrentPages();
        if (temp && temp.length > 0) {
            temp[temp.length - 1].setData({
                isNotHaveNet: !res.isConnected
            });
            //刷新当前页面,弱网时会不会频繁刷新，先注释
            // if(res.isConnected){
            //     wx.redirectTo({url:"/"+temp[temp.length-1].route})
            // }
        }
        base.isNotHaveNet = !res.isConnected
        console.log("onNetworkStatusChange notHaveNet:" + base.isNotHaveNet)
    }
})
wx.selectComponent = function (id) {
    let r = null;
    base.components.forEach((v) => {
        if (v.id === id) {
            if (r === null) {
                r = v;
            } else {
                console.error("id在所有page中要唯一,请修改，现在有多个组件id为" + id + "," + v.is)
                r = v;
            }
        }
    })
    return r;
}
//埋点
let tracker = new Tracker({
    tracks: trackConfig, //上报配置json
    data_type: 0,
    app_id: trackInfo.app_id, //手机端可以删除此项，由代码自动获取
    is0000Error: trackInfo.is0000Error, //wx.request请求返回时 res.data.code != "0000" 是否做为错误上报
    version: trackInfo.version, //上报的小程序版本
    apiUrl: trackInfo.apiUrl, //上报请求的地址
    appKey: trackInfo.appKey, //appKey 和 appSecrect在BI系统中创建
    appSecret: trackInfo.appSecret, //appKey 和 appSecrect在BI系统中创建
    channelId: trackInfo.channelId,
    //根据后台创建的策略，来填写 
    appVersion: trackInfo.appVersion,
})
//增加page方法的勾子
tracker.addPageMethodWrapper(pagefunc);
//增加Component方法的勾子
tracker.addComMethodWrapper(comfunc);

function pagefunc(target, methodName) {
    //console.log("onLoaded")
    if ("onLoad" === methodName) {
        dayNight.initializeTheme();
        target.setData({
            vehicleBackground: dayNight.cutThemeData.ThemeBackground, // 背景颜色
            vehicleBackgroundRGB: dayNight.cutThemeData.ThemeBackgroundRGB, //背景色RGB格式
            vehicleColor: dayNight.cutThemeData.ThemeColor, // 字体颜色
            colorStyle: dayNight.cutThemeData.ThemePattern // 模式 
        })
    }
    if ("onShow" === methodName) {
        //console.log('onShow')
        let curPage = getPageOfCurrent();
        base.lastRoute = curPage.route
    }
}

function comfunc(target, methodName) {
    //console.log("attached")
    //console.log(target)
    if ("attached" === methodName) {
        base.components.push(target);
        dayNight.initializeTheme();
        target.setData({
            vehicleBackground: dayNight.cutThemeData.ThemeBackground, // 背景颜色
            vehicleBackgroundRGB: dayNight.cutThemeData.ThemeBackgroundRGB, //背景色RGB格式
            vehicleColor: dayNight.cutThemeData.ThemeColor, // 字体颜色
            colorStyle: dayNight.cutThemeData.ThemePattern // 模式 
        })
    } else if ("detached" === methodName) {
        base.components.forEach((v, i) => {
            if (v === target) {
                base.components.splice(i, 1);
            }
        })
    }
}
// console.log兼容处理
if (base.systemInfo.device) {
    const consoleLog = console.log;
    Object.defineProperty(console, 'log', {
        get: function () {
            return function (...data) {
                let temp = "";
                data.forEach(item => {
                    if (typeof item === "object" || typeof item === "function") {
                        temp += JSON.stringify(item)
                    } else {
                        temp += item
                    }
                })
                return consoleLog.call(this, temp)
            }
        }
    })
}

//暴露一个全局方法，调试黑白
wx.debugDayNight = dayNight.debug;

console.log('当前环境', base.env)
console.log('basevin', base.vin)
console.log('systemInfo', base.systemInfo)
console.log('loginInfo', base.loginInfo)