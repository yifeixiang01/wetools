const  tracks  = {
  path: 'pages/film-detail/film-detail',
    methodTracks: [{
      method: 'getFilmInfo',
      dataKeys: ['filmId'],
      injectData: {
        event_id:"filmDetailPageGetFilmInfo",
        properties: {
            event_desc: "影片详情页获取影片信息",
        }
      }
    },{
      method: 'toBuyTickts',
      dataKeys: ['filmName', 'preSaleFlag'],
      injectData: {
        event_id:"filmDetailPageToBuyTickets",
        properties: {
            event_desc: "影片详情页点击购票",
        }
      }
    },
    {
      method: 'playVideo',
      dataKeys: ['filmName'],
      injectData: {
        event_id:"filmDetailPagePlayVideo",
        properties: {
            event_desc: "影片详情页点击播放预告片",
        }
      }
    },
    {
      method: 'onShow',
      dataKeys: ["openType","filmName"],
      injectData: {
        event_id:"filmDetailPageShow",
        properties: {
            event_desc: "影片详情页show",
        }
      }
    },
    {
      method: 'onHide',
      dataKeys: [],
      injectData: {
        event_id:"filmDetailPageHide",
        properties: {
          event_desc: "影片详情页hide",
        }
      }
    },
    {
      method: 'onUnload',
      dataKeys: [],
      injectData: {
        event_id:"filmDetailPageUnload",
        properties: {
          event_desc: "影片详情页unload",
        }
      }
    }
  ],
};
export default tracks;