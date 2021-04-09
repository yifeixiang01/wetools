//此文件放入所有的静态常量，代码中不允许再出现硬编码

/************以上是说明********** */

import sysenv from '../libs/env&sysInfo'
import base from '../libs/base';

const apiInfo = {
  appId: '', //腾讯侧小程序真实Id
  smsKey: '',
  //libs中依赖的信息
  appId1: "ca19xxu5fo0hckc8", //login.js强依赖  //业务id,小场景是一个，每个手机小程序是一个
  appId2: "s5wz96bwj6us9cit", //login.js强依赖 //梧桐转化后的小程序appid，用于登录
};
const appInfo = {
  //app.js中依赖的信息
  version: "1.0.0", //小程序版本号//app.js强依赖
  appName: "<weappName>", //app.js强依赖
  appChsName: "<weappNameZh>",
  tabBarList:[   //各小程序tabBar页面要列入下面数组，因为要判断是用 switchTab还redirectTo跳转
    
  ],
  selectedCity: {
    name: ''
  },
  hadShowStartPage: false, //是否显示过启动页
  openByOuter: false,// 是否是从外界直接打开的，如：消息推送
  pushNumber: ''
}

const trackInfo = {
  app_id: apiInfo.appId, //手机端可以删除此项，由代码自动获取
  is0000Error: true, //wx.request请求返回时 res.data.code != "0000" 是否做为错误上报
  version: appInfo.version, //上报的小程序版本
  isShowLog: true
}

//同步常量环境值
const syncConstEnv = function (env) {
  env = env || sysenv.env;
  console.log('当前api环境为' + env);
  base.env = env;
  // const devUrl = '';
  const testUrl = 'https://api.auto-pai.cn';
  const produceUrl = 'https://api.auto-pai.com';
  const baseUrl = env == 'prod' ? produceUrl : testUrl;

  trackInfo.apiUrl = env == 'prod' ? 'https://daq.api.auto-pai.com' : "https://test-daq.api.auto-pai.cn"; //上报请求的地址
  trackInfo.appKey = env == 'prod' ? '78a7a4a52837b631762d1868eeafcea6' : '9d36d011334385ebf2b62ab57501116d'; //appKey 和 appSecrect在BI系统中创建
  trackInfo.appSecret = env == 'prod' ? 'Gw0zvEfQvJSL' : 'Iktb9T9YGw4T'; //appKey 和 appSecrect在BI系统中创建
  trackInfo.channelId = 'wt2.0r';
  //根据后台创建的策略，来填写 
  trackInfo.appVersion = 0;

  //libs中有依赖的信息
  apiInfo.accountLogin = `${baseUrl}/account/api/account/v1/vewx/login`; // 账号中心登录//login.js强依赖
  apiInfo.savePhone = `${baseUrl}/account/api/account/wx/v1/user/savePhone`;
  apiInfo.sendMessage = `${baseUrl}/applet/api/v1/tools/sms/send`; // 发送短信验证码
  apiInfo.toLogin = `${baseUrl}/applet/api/v1/tools/sms/verifyCode`; // 用户平台授权
  apiInfo.getQrCode = `${baseUrl}/account/api/account/tools/qrcode/get_smallapp`; // 获取小程序二维码

  //业务依赖的信息
  apiInfo.getFilmList = `${baseUrl}/gourmet/api/ytb/v1/film/list`; // 影片列表
}



/*
模式：dark（夜间） / light（白天）
黑夜主题背景颜色: "#303240"
白天主题背景颜色: "#FFFFFF"
*/

/* 黑夜模式得文本颜色值 */
const darkColor = {
  which: '#FFFFFF',
  mainColor: '#27ABF8',
  backgroundColor: "#121212",
  backgroundRGB: '240, 243, 247',
  btnBackground: 'linear-gradient(90deg, #0381F1 0%, #27ABF8 100%)',
  colorOpacity1: 'rgba(255,255,255,0.10)',
  colorOpacity2: 'rgba(255,255,255,0.20)',
  colorOpacity3: 'rgba(255,255,255,0.30)',
  colorOpacity4: 'rgba(255,255,255,0.40)',
  colorOpacity5: 'rgba(255,255,255,0.50)',
  colorOpacity6: 'rgba(255,255,255,0.60)',
  colorOpacity7: 'rgba(255,255,255,0.70)',
  colorOpacity8: 'rgba(255,255,255,0.80)',
  colorOpacity9: 'rgba(255,255,255,0.90)',
  colorOpacity10: 'rgba(255,255,255,1)',
  colorOpacity11: 'rgba(42,42,42,1)',
  colorOpacity12: 'rgba(255,255,255,0.10)',
  colorOpacity13: 'rgba(30,30,30,1)',
  colorOpacity14: 'rgba(55,55,55,1)'

}
/* 白天模式得文本颜色值 */
const lightColor = {
  which: '#4C4C4C',
  mainColor: '#27ABF8',
  backgroundColor: "#F0F3F7",
  backgroundRGB: '240, 243, 247',
  btnBackground: 'linear-gradient(90deg, #0381F1 0%, #27ABF8 100%)',
  colorOpacity1: 'rgba(76,76,76,0.10)',
  colorOpacity2: 'rgba(76,76,76,0.20)',
  colorOpacity3: 'rgba(76,76,76,0.30)',
  colorOpacity4: 'rgba(76,76,76,0.40)',
  colorOpacity5: 'rgba(76,76,76,0.50)',
  colorOpacity6: 'rgba(76,76,76,0.60)',
  colorOpacity7: 'rgba(76,76,76,0.70)',
  colorOpacity8: 'rgba(76,76,76,0.80)',
  colorOpacity9: 'rgba(76,76,76,0.90)',
  colorOpacity10: 'rgba(76,76,76,1)',
  colorOpacity11: 'rgba(255,255,255,1)',
  colorOpacity12: 'rgba(255,255,255,1)',
  colorOpacity13: 'rgba(240, 240, 240, 1)',
  colorOpacity14: 'rgba(204,204,204,1)',
}




//注意 上车机是生产环境prod，如需在车机上用test环境使用sysenv.env = 'test'，prod
if (sysenv.env === 'dev') {
  trackInfo.isShowLog = false;
  //通过车机获得token在电脑中开发，7天有效token，过期再抓数据
  let temp =  {"expiredTime":1616515200973,"token":"kaJI7bZr/E1tlKYIHotLNLJP1JiH7MHKNWf2+Wq9hLuuprieBZ9w+IemkqMZKUaL2K46gQ2Xm3ZR9a9mZ63TNIuGXb64Ms83a3Xk87dgebBH6b5p6G2hOtreYiOA5qbQENW2VCnHNZyi5iMbuYnXL546fBFr+4QanqKZaC/VEV4lJhnG/o8N/VHOhN5u4v1VdXLGzwlySF5p1VRgbcsK8fLwmA7p7jDgTc+xEjX95V08czmZOs4OHfAp7EAh8/J+j9ZtOktzpJd+slyZi05IY8cowtdoRdiK1c0feuR93VSE338GNiXT8OmG2WkOFoLxCPE6P9mYr277tDpDxO4R64shiJ7no423dShv1KBgeM6xvIe8AGML3rFIAGa0cHFb+p8A4jkS5u86JBnkNcn2hQ==;hp2wE56jVLBajhQzSfIMe+mjo/8=","userId":"a9deebc671b44f6ab2dd00bce066d4ea","openId":"083474430f70578aa5e33a7d09ebd656","phone":"13121862624","dataKey":"9PnwQPoSbILy8OQqF8XCj7B3AID1Fw2HnArHQPMV6CM=","wtId":null,"signature":"bcbf5f5a60cd970a2053ed02fbfec3353b6153c8"}
  base.loginInfo = temp;
  wx.setStorageSync("loginInfo", temp);
}

if(base.systemInfo.channel_id==88888 || (base.systemInfo.brand === "devtools" && base.systemInfo.platform === "devtools")){
  sysenv.env = 'test'
}else{
  sysenv.env = 'prod'
}
sysenv.env = 'prod' //开发工具中使用生产环境接口

syncConstEnv();

console.log("小程序版本号"+appInfo.appName+" version/"+ appInfo.appChsName +"版本号:"+appInfo.version)

export {
  apiInfo,
  appInfo,
  trackInfo,
  syncConstEnv,
  darkColor,
  lightColor
}