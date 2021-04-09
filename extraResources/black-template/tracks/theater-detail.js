const  tracks  = {
  path: 'pages/theater-detail/theater-detail',
    methodTracks: [{
      method: 'getFilmPlan',
      dataKeys: ['theaterInfo.theaterId', 'theaterInfo.theaterName', 'openType', 'cutFilmName'],
      injectData: {
        event_id:"getFilmPlan",
        properties: {
          event_desc: "影院详情页获取排期"
        }
      }
    },
    {
      method: 'toFilmDetail',
      dataKeys: ['filmName'],
      injectData: {
        event_id:"theaterDetailToFilmDetail",
        properties: {
          event_desc: "影院详情页获取排期"
        }
      }
    },
    {
      method: 'chooseSeats',
      dataKeys: ['theaterInfo.theaterName', 'cutFilmName', 'planInfo'],
      injectData: {
        event_id:"theaterDetailToChooseSeats",
        properties: {
          event_desc: "影院详情页获取排期"
        }
      }
    },
    {
      method: 'onShow',
      dataKeys: ["$APP.globalData"],
      injectData: {
        event_id:"theaterDetailPageShow",
        properties: {
          event_desc: "影院详情页show"
        }
      }
    },
    {
      method: 'onHide',
      dataKeys: [],
      injectData: {
        event_id:"theaterDetailPageHide",
        properties: {
          event_desc: "影院详情页hide"
        }
      }
    },
    {
      method: 'onUnload',
      dataKeys: [],
      injectData: {
        event_id:"theaterDetailPageUnload",
        properties: {
          event_desc: "影院详情页unload"
        }
      }
    }
  ],
};
export default tracks;