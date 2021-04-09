const sysenv = {}
wx.getSystemInfo({
    success: (res) => {
        //8x车机上这个值返回时间 5ms
        if (!res.device && res.brand === "devtools" && res.platform === "devtools") {
            sysenv.env = "dev"
        } else {
            sysenv.env = "prod"
        }
        sysenv.systemInfo = res;
    }
});
export default sysenv