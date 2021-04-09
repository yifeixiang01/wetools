import base from './base'
import {login} from "./login"
//fail:加参数是否显示错误与重试的信息，是否显示loading动画
//options.isShowToast 默认true
//options.isShowLoading 默认true
const http = function (options) {
  if(typeof options.isShowLoading === 'undefined'){
    options.isShowLoading = true;
  }
  if(typeof options.isShowToast === 'undefined'){
    options.isShowToast = true;
  }
  const H = (options) => {
    return new Promise((s, f) => {
      if (!options) {
        console.error('options is null');
        f();
      };
      if(options.isShowLoading){
        wx.showLoading();
      }
      const header = {
        'content-type': 'application/json', // 默认值
        token: base.loginInfo.token,
        userId: base.loginInfo.userId,
        phone: base.loginInfo.phone
      }
      let startTime = Date.now();
      console.log("http请求参数", options)

      wx.request({
        url: options.url,
        data: options.data || {},
        method: options.method || 'GET',
        header: header,
        dataType: options.dataType || 'json',
        responseType: options.responseType || 'text',
        success: res => {
          console.log(Date.now() - startTime + "ms 请求" + options.url)
          if (res.data.code && res.data.code === '0000') {
            s(res);
          } else if (res.data.code === 'E0007') {
            console.log("token is invalid 自动重新登录，并重新请求")
            login().then(function () {
              H(options)
            })
          } else {
            f(res);
          }
        },
        fail: res => {
          console.log(Date.now() - startTime + "ms 请求" + options.url)
          console.log("请求header", header)
          console.log("返回结果错误2", res)
          if (options.isShowToast) {
            wx.showToast({
              title: '网络请求失败，请稍后重试',
              icon: 'none'
            })
          }
          f(false);
        },
        complete: function (res) {
          console.log('http complete', res)
          if(options.isShowLoading){
            wx.hideLoading()
          }
        }
      })

      
    })
  }
  return H(options);
}

export default http;