import base from 'base.js'
import {
  apiInfo
} from '../utils/constants'
import {
  redirectToAddReturnUrl,
  navigateToAddReturnUrl,
  getPageOfCurrent
} from './utils'
/**
1.小程序一次运行，第一次登录以后，不主动检查小场景退出，小场景切换账号的情况，继续使用原登录信息，部分有需求的小程序可以填加退出登录按钮
主要原因是增加了程序复杂度，与页面响应时间
2.建议小程序框架提供登录、退出的事件监听，则可以解决以上问题
3.强登录小程序启动时，用getuserInfo的签名检查是否为同一个用户，检查缓存的token有效期，如都是则用以前的token继续登录，节约启动时间
4.强登录小程序每个可能成为入口的页面都应该使用login进行检查登录状态，已登录会自动跳过，以base.loginInfo为判断信息,直接使用login().then即可
 * @param {options} isShowWxLoading
 * @return {Promise}
 */
function login({
  isShowWxLoading = true
} = {
  isShowWxLoading: true
}) {
  console.log("base.loginInfo:" + JSON.stringify(base.loginInfo));
  let st = Date.now(); //性能记录
  console.log("开始Login");
  const wxLogin = function (s, j) {
    let wxloginst = Date.now(); //性能记录
    wx.login({
      success: function (codea) {
        let code = codea.code;
        console.log((Date.now() - wxloginst) + "wxlogin获取code成功" + (Date.now() - st) + "_" + JSON.stringify(codea));
        wx.getUserInfo({
          success: function (message) {
            console.log("getUserInfo获取用户信息" + (Date.now() - st) + "_" + JSON.stringify(message));
            let data = {
              appid: apiInfo.appId1,
              sign: "",
              data: {
                appid: apiInfo.appId2,
                wxCode: code,
                errMsg: message.errMsg,
                rawData: "",
                signature: message.signature,
                encryptedData: message.encryptedData,
                iv: message.iv,
                vin: base.vin,
                userInfo: {
                  nickName: message.userInfo.nickName,
                  avatarUrl: message.userInfo.avatarUrl,
                  gender: message.userInfo.gender
                }
              }
            };
            base.loginInfo.signature = message.signature;
            base.userInfo = data.data.userInfo;
            console.log('登录参数：' + JSON.stringify(data));
            wxloginst = Date.now(); //性能记录
            wx.request({
              url: apiInfo.accountLogin,
              method: "POST",
              dataType: "json",
              data: data,
              header: {
                "content-type": "application/json"
              },
              success: function (res) {
                if (res.data.code == "0000") {
                  //存储效验参数
                  let data = res.data.data;
                  base.loginInfo.token = data.token;
                  base.loginInfo.expiredTime = data.expiredTime;
                  base.loginInfo.dataKey = data.dataKey;
                  base.loginInfo.openId = data.openId;
                  base.loginInfo.userId = data.userId;
                  base.loginInfo.wtId = data.wtId;
                  wx.setStorageSync("loginInfo", base.loginInfo);
                  wx.setStorageSync('user_id', res.data.data.userId) //埋点使用
                  s(base.loginInfo);
                  console.log((Date.now() - wxloginst) + "登陆成功" + (Date.now() - st) + JSON.stringify(res));
                } else {
                  wx.showToast({
                    title: '登录失败(1004)',
                    duration: 600,
                  })
                  console.log('accountlogin失败,res.data.code!=0000')
                  console.log('accountlogin失败' + JSON.stringify(res))
                  j(res);
                }
                wx.hideLoading()
              },
              fail: function (e) {
                wx.hideLoading()
                wx.showToast({
                  title: '登录失败(1003)',
                  duration: 600,
                })
                console.log('accountlogin失败' + JSON.stringify(e));
                j(e);
              }
            });
          },
          fail: function (e) {
            wx.hideLoading()
            wx.showToast({
              title: '登录失败(1002)',
              duration: 600,
            })
            console.log('getUserInfo失败' + JSON.stringify(e));
            j(e);
          }
        });
      },
      fail: function (e) {
        // wx.showToast({   //通常是用户主动关闭了二维码页面，弹出信息不太合适
        //   title: '登录失败(1001)',
        //   duration: 600,
        // })
        wx.hideLoading()
        console.log('wx.login失败' + JSON.stringify(e));
        if(e.errMsg==="login:fail, Local Server error!"){
          wx.showToast({   //通常是用户主动关闭了二维码页面，弹出信息不太合适
            title: '登录失败(1001),检查网络',
            duration: 600,
            icon: 'none'
          })
        }
        j(e);
      }
    })
  }
  return new Promise((s, j) => {
    //此次会话已登录过
    if (base.loginInfo && base.loginInfo.expiredTime && base.loginInfo.expiredTime - Date.now() >= 1200000) {
      s(base.loginInfo);
      return;
    }
    //此次会话未登录
    let loginInfo = wx.getStorageSync('loginInfo');
    // if(loginInfo.expiredTime){  //在这里使用缓存会有严重问题，导致用户第一次关闭二维码，再打开时base.loginInfo已存在信息，会误登录
    //   base.loginInfo = loginInfo;
    // }
    console.log("缓存的loginInfo", loginInfo)
    isShowWxLoading && wx.showLoading({
      title: "登录中...",
      mask: true
    })
    //token过期时间大于20分钟,防止用着用着过期了
    if (loginInfo && loginInfo.expiredTime && loginInfo.expiredTime - Date.now() >= 1200000) { //存在已登录状态
      wx.getUserInfo({
        success: function (res) {
          console.log((Date.now() - st) + "getUserInfo1:" + JSON.stringify(res))
          if (res.signature != loginInfo.signature) { //不同用户，需要重新登录
            console.log("签名不同重新登录")
            wxLogin(s, j)
          } else { //同一用户，登录成功
            //不能使用缓存的手机号，因为用户有可能会更改绑定的信息
            // if(loginInfo.expiredTime){
            //   base.loginInfo = loginInfo;//使用缓存的信息
            // }
            console.log("签名相同直接登录" + JSON.stringify(loginInfo))
            base.userInfo.nickName = res.userInfo.nickName; //更新userInfo
            base.userInfo.avatarUrl = res.userInfo.avatarUrl;
            base.userInfo.gender = res.userInfo.gender;
            base.loginInfo = loginInfo;//还是要使用缓存，否则每次进入都要授权
            s(loginInfo);
            wx.hideLoading()
          }
        },
        fail: function (res) {
          //{"errMsg":"getUserInfo:fail, userid not exist"}
          if (res.errMsg && res.errMsg.toLowerCase().indexOf('userid not exist') !== -1) {
            console.log("getUserInfo取消" + JSON.stringify(res))
            j(res);
          } else {
            //{"errMsg":"getUserInfo:fail, authorization required"}
            //{"errMsg":"getUserInfo:fail, auth expired"}
            console.log("getUserInfo fail" + JSON.stringify(res))
            wxLogin(s, j)
          }
          wx.hideLoading()
        }
      })
    } else { //token过期，需要重新登录
      wxLogin(s, j)
    }
  })
};

function logOut() {
  base.loginInfo = {};
  wx.removeStorage({
    key: 'loginInfo',
  })
}
//非强登录小程序，可以在catch中处理取消登录的逻辑
function checkAndLogin({
  isNeedPhone = true,
  isNeedAgree = true,
  isMustLogin = true,
  isShowWxLoading = true
} = {
  isNeedPhone: true,
  isNeedAgree: true,
  isMustLogin: true,
  isShowWxLoading: true
}) {
  base.isNeedPhone = isNeedPhone;
  console.log("checkLogin参数", isNeedPhone, isNeedAgree, isMustLogin)

  function taiAndPhone(s, j) {
    //过期时间没有，或小于20分钟时,需要重新登录
    // 执行登录
    login({
      isShowWxLoading
    }).then(() => {
      // 登录成功
      if (isNeedPhone) {
        if (base.loginInfo.phone) {
          console.log('已有电话')
          s(base.loginInfo);
        } else {
          console.log('无电话')
          setTimeout(() => {
            j(false)
            if (isMustLogin && getPageOfCurrent().route !== 'pages/loginPages/accredit/accredit') {
              redirectToAddReturnUrl('/pages/loginPages/accredit/accredit')
              console.log('redirectTo跳转到手机号授权')
            } else {
              navigateToAddReturnUrl('/pages/loginPages/accredit/accredit')
              console.log('navigateTo跳转到手机号授权')
            }
          }, 501)
        }
      } else {
        console.log('无需电话')
        s(base.loginInfo);
      }
    }).catch((res) => {
      console.log('loginfail catch，通常是取消了1', res)
      setTimeout(() => {
        //车机上redirectTo本页面不会刷新，会报错白屏
        if (isMustLogin && getPageOfCurrent().route !== 'pages/loginPages/taiLogin/taiLogin') {
          console.log("强登录，跳转taiLogin")
          redirectToAddReturnUrl('/pages/loginPages/taiLogin/taiLogin')
          j(false)
        } else {
          //非强登录，不用跳转
          console.log("非强登录")
          j(res)
        }
      }, 501)
      console.log('loginfail catch，通常是取消了2')
    })
  };
  return new Promise(function (s, j) {
    const agree = wx.getStorageSync('agree')
    if (isNeedAgree && !agree) {
      console.log('未同意过协议')
      setTimeout(() => {
        j(false)
        if (isMustLogin) {
          redirectToAddReturnUrl('/pages/loginPages/protocol/protocol')
        } else {
          navigateToAddReturnUrl('/pages/loginPages/protocol/protocol')
        }
      }, 501)
    } else {
      console.log('已同意协议或不需要协议')
      taiAndPhone(s, j)
    }
  })
}
//此check不考虑过期
function checkLogin() {
  if (!base.loginInfo.expiredTime) {
    return false;
  } else {
    return true;
  }
}
//此check不考虑过期
function checkPhone() {
  if (!base.loginInfo.phone) {
    return false;
  } else {
    return true;
  }
}

//监听小场景退出
if (wx.onTaiAccountStatusChange) {
  wx.onTaiAccountStatusChange(function (res) {
    if (!res.isLoginUser) {
      logOut();
    }
  })
}
export {
  login,
  logOut,
  checkAndLogin,
  checkLogin,
  checkPhone
}