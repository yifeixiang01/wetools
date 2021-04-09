const  tracks  = {
  path: 'pages/my/my',
    methodTracks: [{
      method: 'getOrderList',
      dataKeys: ['ordersNum'],
      injectData: {
        event_id: "getOrderList",
        properties: {
          event_desc: "个人中心页获取订单列表"
        }
      }
    },{
      method: 'clickOrder',
      dataKeys: ['curItem.orderStatus', 'curItem.orderId'],
      injectData: {
        event_id: "clickOrder",
        properties: {
          event_desc: "个人中心页选择订单"
        }
      }
    },
    {
      method: 'onShow',
      dataKeys: [],
      injectData: {
        event_id:"userCenterPageShow",
        properties: {
          event_desc: "个人中心页show"
        }
      }
    },
    {
      method: 'onHide',
      dataKeys: [],
      injectData: {
        event_id:"userCenterPageHide",
        properties: {
          event_desc: "个人中心页hide"
        }
      }
    },
    {
      method: 'onUnload',
      dataKeys: [],
      injectData: {
        event_id:"userCenterPageHide",
        properties: {
          event_desc: "个人中心页unload"
        }
      }
    }
  ],
};
export default tracks;