
//1.0.6 console.log不需要主动改为string,在车机会自动改为string
//1.1.0 黑白模式，自动注入到data
//1.2.0 改变components组件缓存到base中，提供selectComponents的补丁
//增加了checkAndLogin，登录逻辑，http中增加了默认异常处理
//2.0.0 改变了登录方式,对compenonts和constants中有些依赖
//2.0.2 增加loginPage中按钮的节流
//2.0.3 constants中增加了判断，88888和项目线可以发同一个包了，88888会自动是测试api，项目线是生产api
//2.0.4 解决my未登录回退功能，和页面跳转时机，在ready之后
//2.0.5 goback的bug
//2.0.5a 手机号授权失败的处理
//2.0.6 checkLogin中的跳转增加250ms的延迟，防止跳转太快框架无响应，目前已知框架前后跳转必须间隔500ms
//2.0.7 手机号授权缓存问题修改//此版本登录有严重问题，必须升级到2.0.8
//console.log("base 2.0.8") //不使用loginInfo的缓存，防止出现换账号登录后，还使用上个账号的缓存信息;accedit完善手机号授权信息的异常处理;修改协议页关闭二维码登录时的返回处理;checkLogin的跳转延迟改为501ms
//console.log("base 2.0.9") //accedit页面授权按钮的可点击状态优化
//console.log("base 2.0.10") //phoneLogin页面输入框清除错误提示缓存
//console.log("base 2.0.11") //增加无网时，点击登录按的异常提示
//console.log("base 2.0.12") //修改圆角6px为1vh。增加网络异常不能登录时的提醒
console.log("base 2.0.13") //增加了checkAndLogin的异常返回
import sysenv from "./env&sysInfo";
const base = {
    env: sysenv.env, //dev本地开发,test车机中调整测试,prod生产
    vin:"",
    loginInfo:{
        expiredTime:0,
        token:"",
        userId:"",
        openId:"",
        phone:"",
        dataKey:"",
        wtId:""
    },
    userInfo:{
        nickName: "",
        avatarUrl: "",
        gender: ""
    },
    systemInfo:sysenv.systemInfo,
    isNotHaveNet:false,
    components: []
};

if(wx.getVechicleId){
    wx.getVechicleId({ // 获取vin
        success: function (res) {
            base.vin = res.vechicleId
        }
      })
}

wx.getNetworkType({
    success: function (res) {
        console.log("getNetworkType"+JSON.stringify(res))
        //res.networkType == "unknwon"不确定
        if (res.networkType == "none") {
            base.isNotHaveNet = true;
        } else {
            base.isNotHaveNet = false;
        }
        if(typeof getCurrentPages !== 'undefined'){
            let temp = getCurrentPages();
            if(temp && temp.length>0){
                temp[temp.length-1].setData({
                    isNotHaveNet: base.isNotHaveNet
                });
            }
        }
    }
})
export default base;