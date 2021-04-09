const  tracks  = {
  path: 'pages/choose-seats/choose-seats',
    methodTracks: [{
      method: 'getSeatsInfo',
      dataKeys: ['theaterInfo.theaterId', 'filmPlan.featureAppNo'],
      injectData: {
        event_id: "getSeatsInfo",
        properties: {
          event_desc: "选座页获取座位信息",
        }
      }
    },{
      method: 'createOrder',
      dataKeys: ['seatNoList', 'pushNumber'],
      injectData: {
        event_id: "confirmSeats",
        properties: {
          event_desc: "选座页获取创建订单",
        }
      }
    },
    {
      method: 'onShow',
      dataKeys: ["theaterInfo.theaterName", "filmPlan.hallName", "filmPlan.startDayStr","filmPlan.startTimeStr", "filmPlan.endTimeStr"],
      injectData: {
        event_id:"chooseSeatsPageShow",
        properties: {
          event_desc: "进入选座页",
        }
      }
    },
    {
      method: 'onHide',
      dataKeys: [],
      injectData: {
        event_id:"chooseSeatsPageHide",
        properties: {
          event_desc: "选座页进入后台",
        }
      }
    },
    {
      method: 'onUnload',
      dataKeys: [],
      injectData: {
        event_id:"chooseSeatsPageUnload",
        properties: {
          event_desc: "选座页Unload",
        }
      }
    }
  ],
};
export default tracks;