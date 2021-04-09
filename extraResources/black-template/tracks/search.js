const tracks = {
  path: 'pages/search/search',
  methodTracks: [{
    //方法名称 
    method: 'searchData',
    //上报数据
    dataKeys: ['keyword'],
    injectData: {
      event_id: "searchFilmAndTheater",
      properties: {
        event_desc: "点击搜索按钮搜索数据",
      }
    }
  },
  {
    method: 'onShow',
    dataKeys: [],
    injectData: {
      event_id: "searchPageShow",
      properties: {
        event_desc: "进入搜索页"
      }
    }
  },
  {
    method: 'onHide',
    dataKeys: [],
    injectData: {
      event_id: "searchPageHide",
      properties: {
        event_desc: "搜索页hide"
      }
    }
  },
  {
    method: 'onUnload',
    dataKeys: [],
    injectData: {
      event_id: "searchPageUnload",
      properties: {
        event_desc: "搜索页unload"
      }
    }
  }
  ],
};
export default tracks;