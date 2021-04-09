const tracks = {
  path: 'app', //app这个是写死的固定值
  methodTracks: [
    {
      method:'onShow',
      dataKeys:[],
      injectData:{
        event_id:'appShow',
        properties:{
          event_desc:"app启动",
        }
      }
    },
    {
      method:'onHide',
      dataKeys:[],
      injectData:{
        event_id:'appHide',
        properties:{
          event_desc:"app隐藏",
          firstRunTime:Date.now(),
        }
      }
    }
  ],
};
export default tracks;