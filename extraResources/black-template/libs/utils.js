import {
  appInfo
} from "../utils/constants"

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 加载loading
function loading(title) {
  wx.showLoading({
    title: title,
    mask: true
  })
}

// 消息提示框
function showToast(title, time) {
  time = time || 600
  wx.showToast({
    title: title,
    icon: 'none',
    duration: time
  })
}

// 节流函数
// 要执行的func，调用时立马执行一次，wait时间内不可再次执行，可保留最后一次未执行，
// isRunFinal 最后一次是否运行，否则丢弃
// 多用于拖动，动画，鼠标move事件
function throttle(func, wait, isRunFinal = false) {
  let lastTimeoutID;
  let alreadyDo = false
  return function () {
    const that = this
    const args = arguments
    if (!alreadyDo) {
      alreadyDo = true
      setTimeout(function () {
        alreadyDo = false
      }, wait)
      clearTimeout(lastTimeoutID)
      func.apply(that, args)
    } else if (isRunFinal) { // 保留不能立即运行最后一次方法
      clearTimeout(lastTimeoutID)
      lastTimeoutID = setTimeout(function () {
        func.apply(that, args)
      }, wait)
    }
  }
}

// 防抖函数
// 延迟响应，防止多次无用触发
// 多用于请求数据多变的网络请求，只用wait延迟后，最后一次的执行
// 例如滚动多个卡片，每个方块加载都是卡片的，如果快速滚动到第3个，第2个也会加载，用此方法，可以让第2个的异步加载不执行。
function debounce(func, wait) {
  let lastTimeoutID
  return function () {
    const that = this
    const args = arguments
    clearTimeout(lastTimeoutID)
    lastTimeoutID = setTimeout(function () {
      func.apply(that, args)
    }, wait)
  }
}

// 带loading自动关闭loading的异步封装,没写完呢
// function promiseWithLoading({loadTitle,promiseFunc}){
//     showLoading(loadTitle||"")
//     return new Promise(function(resolve,reject){
//         promiseFunc().then(resolve,reject).finally(function(){
//             wx.hideLoading({
//               complete: (res) => {},
//             })
//         })
//     })
// }

/*
//只执行一次的函数
*/
function singleFunc(func) {
  let isRun = false
  return function () {
    const args = arguments
    if (isRun) return
    func.apply(this, args)
    isRun = true
  }
}

/**
 * 获取定位信息，时效内使用缓存位置，无定位返回预存定位
 * @param {any} t - 期待时效数字毫秒,不传默认5000
 * @return {Promise} 只有then,没有catch
 */
const getLocation = (function () {
  let lastTime = 0
  let lastLocation = {
    latitude: 39.95933,
    longitude: 116.29845
  }
  // return function(){
  //   return new Promise((resolve, reject) => {
  //     // resolve({latitude: 29.59,longitude: 106.54})//重庆坐标
  //     resolve({latitude: 40.088974,longitude: 116.312771})//中图能源,
  //   })
  // }
  const storageLocation = wx.getStorageSync('lastLocation')
  if (storageLocation) {
    lastLocation = storageLocation
  }
  let geting = false
  let getingPromise
  return function (t = 5000) {
    // lastTime首次为0，则第一次肯定会更新坐标
    if ((Date.now() - lastTime) < t) {
      return new Promise((resolve, reject) => {
        resolve(lastLocation, false)
      })
    } else {
      if (geting) return getingPromise
      getingPromise = new Promise((resolve, reject) => {
        geting = true
        wx.getLocation({
          type: 'wgs84',
          success: (result) => {
            console.log('getLocationSuccess:' + JSON.stringify(result))
            geting = false
            lastLocation = result
            lastTime = Date.now()
            wx.setStorage({
              key: 'lastLocation',
              data: result
            })
            resolve(result, false)
          },
          fail: (res) => {
            console.log('getLocationFail:' + JSON.stringify(res))
            geting = false
            wx.showToast({
              title: '获取位置失败',
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false
            })
            // 使用缓存的定位信息，如果业务需要特别处理，可以使用第二个参数isFail来判断
            resolve(lastLocation, true)
          }
        })
      })
      return getingPromise
    }
  }
})()
setTimeout(() => {
  getLocation()
}, 200) // 预加载定位，加快首屏需要定位的显示速度

const json2uri = function (j) {
  let temp = ''
  for (const key in j) {
    if (temp != '') temp += '&'
    temp += key + '=' + j[key]
  }
  return temp
}

const redirectToAddReturnUrl = function (path) {
  const pages = getCurrentPages();
  const curPage = pages[pages.length - 1]
  const url = path + '?returnPath='+encodeURIComponent('/' + curPage.route+'?'+json2uri(curPage.options));
  wx.redirectTo({
    url,
    fail:res=>{console.log(res)}
  })
  console.log('redirectTo',url);
}

const navigateToAddReturnUrl = function (path) {
  console.log('navigateToAddReturnUrl'+path)
  wx.navigateTo({
    url: path + '?returnPath=back'
  })
}
//监听网络状态
function onNetworkTypeChange({
  success,
  fail
}) {
  wx.onNetworkStatusChange(function (res) {
    console.log(res)
    if (res.isConnected) {
      success && success();
    } else {
      fail && fail();
    }
  })
}
//获取当前页面的this
function getPageOfCurrent() {
  let pages = getCurrentPages();
  let pagesLen = pages.length;
  return pages[pagesLen - 1];
}

var formateDate = function (date) {
  var nowDate = new Date();
  // var nowYear = nowDate.getFullYear();
  // var nowMonth = nowDate.getMonth();
  var nowDay = nowDate.getDate();
  var time = new Date(date)
  var year = time.getFullYear();
  var month = time.getMonth();
  var day = time.getDate();


  var week = ''

  switch (day - nowDay) {
    case 0:
      week = '今天';
      break;
    case 1:
      week = '明天';
      break;
    case 2:
      week = '后天';
      break;
    default:
      week = getWeek(time.getDay());
      break;
  }
  return {
    year: year,
    month: month + 1,
    day: day,
    week: week
  }
}
var getWeek = function (day) {
  var week = '';
  switch (day) {
    case 1:
      week = '周一'
      break;
    case 2:
      week = '周二'
      break;
    case 3:
      week = '周三'
      break;
    case 4:
      week = '周四'
      break;
    case 5:
      week = '周五'
      break;
    case 6:
      week = '周六'
      break;
    default:
      week = '周日'
      break;
  };
  return week
}

function goBackUrl(url){
    //判断跳转页面
    if (url) {
      url = decodeURIComponent(url);
      if(!url.startsWith('/')) url = '/' + url;
      console.log("returnurl", url)
      if (url === "/back") {
        wx.navigateBack({
          delta: 1,
          complete:function(){
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      } else {
        let tab = 0;
        console.log("goback that.data.options.returnPath",url);
        appInfo.tabBarList && appInfo.tabBarList.forEach((v) => {
          if (url.indexOf(v) !== -1) {
            tab = 1;
          }
        })
        if (tab) {
          wx.switchTab({
            url: url,
            fail:()=>{
              wx.redirectTo({
                url: url,
                complete:function(){
                  wx.hideLoading({
                    success: (res) => {},
                  })
                }
              })
            },
            success:function(){
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        } else {
          wx.redirectTo({
            url: url,
            complete:function(){
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        }
      }
    } else {
      console.log("reLaunch index")
      wx.reLaunch({
        url: '/pages/index/index',
        complete:function(){
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    }
}

function goBack(that) {
  //判断跳转页面
  if (that.data.options) {
    goBackUrl(that.data.options.returnPath)
  }
}
//获取字符长度
function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);
      if (a.match(/[^\x00-\xff]/ig) != null) {
        len += 2;
      }else{
        len += 1;
      }
    }
    return len;
}
export {
  navigateToAddReturnUrl,
  redirectToAddReturnUrl,
  formatNumber,
  formatTime,
  loading,
  showToast,
  singleFunc,
  debounce,
  throttle,
  getLocation,
  json2uri,
  onNetworkTypeChange,
  getPageOfCurrent,
  formateDate,
  goBack,
  getByteLen,
  goBackUrl
}