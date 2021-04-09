const tracks = {
  path: 'pages/index/index',
  //dataKeys 可以使用的特殊字段 $APP $DATASET $INDEX , 默认读取的是page.data下的变量， $INDEX 即 $DATASET.index，$DATASET是所点击元素的dataSet。$APP则为全局getAPP(),$STORAGE.any，可以上报storage中缓存的数据,“any”替换为要上报的key
  methodTracks: [
    {
      method: 'getListData',
      dataKeys: ['params'],
      injectData: {
        event_id:"getFilmList",
        properties: { 
          event_desc: "首页获取影片列表数据",
        }
      }
    },
    {
      method: 'toBuyTickts',
      dataKeys: ['filmData.filmName', 'filmData.id'],
      injectData: {
        event_id: 'homePageToBuyTickets',
        properties: { 
          event_desc: "影片列表页点击购买按钮",
        }
      }
    },
    {
      method: 'toFilmDetail',
      dataKeys: ['filmData.filmName', 'preSaleFlag'],
      injectData: {
        event_id: 'homePageToFilmDetail',
        properties: {
          event_desc: "影片列表页点击影片卡片跳转影片详情页",
        }
      }
    },
  //page的onShow、onHide、onUnload不要删除，可以修改dataKeys和injectData,否则页面生存时间不能记录
  //并且page页要保证有onShow、onHide、onUnload三个
  {
    method: 'onShow',
    //上报数据
    dataKeys: ['$APP.globalData.openType', '$APP.globalData.pushNumber'],
    injectData: {
      event_id: "homePageShow",
      properties: {
        event_desc: "进入影片页"
      }
    }
  },
  {
    method: 'onHide',
    dataKeys: [],
    injectData: {
      event_id: "homePageHide",
      properties: {
        event_desc: "影片列表页隐藏"
      }
    }
  },
  {
    method: 'onUnload',
    dataKeys: [],
    injectData: {
      event_id: "homePageUnload",
      properties: {
        event_desc: "影片列表页unload"
      }
    }
  }
  ],
};
export default tracks;