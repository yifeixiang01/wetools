const  tracks  = {
  path: 'pages/payment/payment',
    methodTracks: [{
      method: 'openNavigation',
      dataKeys: ['orderDetail.filmName', '$APP.globalData.openType', '$APP.globalData.pushNumber',"orderDetail.latitude","orderDetail.longitude"],
      injectData: {
        event_id: "paymentPageToNav",
        properties: {
          event_desc: "支付订单页跳转地图导航"
        }
      }
    },{
      method: 'callBackHome',
      dataKeys: [],
      injectData: {
        event_id: "paymentPageToHome",
        properties: {
          event_desc: "支付订单页回到首页"
        }
      }
    },
    {
      method: 'callbackConfirm',
      dataKeys: [],
      injectData: {
        event_id: "paymentPageTimeout",
        properties: {
          event_desc: "支付订单页回到首页"
        }
      }
    },
    {
      method: 'showPayTranstion',
      dataKeys: ['orderDetail.latitude', 'orderDetail.longitude', 'orderDetail.cinemaName'],
      injectData: {
        event_id:"paymentPageShow",
        properties: {
          event_desc: "支付成功"
        }
      }
    },
    {
      method: 'onShow',
      dataKeys: ["$APP.globalData", "orderId"],
      injectData: {
        event_id:"paymentPageShow",
        properties: {
          event_desc: "支付页show"
        }
      }
    },
    {
      method: 'onHide',
      dataKeys: [],
      injectData: {
        event_id:"paymentPageHide",
        properties: {
          event_desc: "支付页hide"
        }
      }
    },
    {
      method: 'onUnload',
      dataKeys: [],
      injectData: {
        event_id:"paymentPageHide",
        properties: {
          event_desc: "支付页unload"
        }
      }
    }
  ],
};
export default tracks;