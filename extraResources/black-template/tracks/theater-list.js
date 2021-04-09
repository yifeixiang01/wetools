const tracks = {
    path: 'pages/theater-list/theater-list',
    methodTracks: [{
      method: 'toMap',
      dataKeys: ['theaterData.latitude', 'theaterData.longitude'],
      injectData: {
        event_id: "theaterListToMap ",
        properties: {   
          event_desc: "影院列表跳转车机导航"
        }
      }
    },
      {
        method: 'toTheaterDetail',
        dataKeys: ['theaterData.cinemaName', 'theaterData.cinemaId', 'theaterData.minPrice', 'theaterData.latitude','theaterData.distance','theaterData.address'],
        injectData: {
          event_id: "theaterListPageToTheaterDetail",
          properties: {
            event_desc: "影院列表页点击影院卡片跳转影院详情页",
          }
        }
      },
    {
      method: 'onShow',
      dataKeys: [],
      injectData: {
        event_id: "theaterListPageShow",
        properties: {
          event_desc: "影院列表页show"
        }
      }
    },
    {
      method: 'onHide',
      dataKeys: [],
      injectData: {
        event_id: "theaterListPageHide",
        properties: {
          event_desc: "影院列表页hide"
        }
      }
    },
    {
      method: 'onUnload',
      dataKeys: [],
      injectData: {
        event_id: "theaterListPageUnload",
        properties: {
          event_desc: "影院列表页Unload"
        }
      }
    }
    ],
  };
  export default tracks;