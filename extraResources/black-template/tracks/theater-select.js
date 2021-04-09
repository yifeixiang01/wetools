const tracks = {
    path: 'pages/theater-select/theater-select',
    methodTracks: [{
        method: 'getTheaterList',
        dataKeys: ['latitude', 'longitude'],
        injectData: {
            event_id: "theaterSelectPageGetTheaterList",
            properties: {
                event_desc: "影院选择页获取影院列表",
            }
        }
    },
    {
        method: 'reloadData',
        dataKeys: ['cinemaname', 'address', 'distancestr', 'lat', 'lon', 'minprice'],
        injectData: {
            event_id: "theaterSelectPageReloadData",
            properties: {
                event_desc: "影院选择页重新加载数据",
            }
        }
    },
    {
        method: 'onShow',
        dataKeys: ['lat', 'lon', 'types'],
        injectData: {
            event_id: "theaterSlectPageShow",
            properties: {
                event_desc: "影院选择页show",
            }
        }
    },
    {
        method: 'onHide',
        dataKeys: [],
        injectData: {
            event_id: "theaterSelectPageHide",
            properties: {
                event_desc: "影院选择页hide",
            }
        }
    },
    {
        method: 'onUnload',
        dataKeys: [],
        injectData: {
            event_id: "theaterSelectPageUnload",
            properties: {
                event_desc: "影院选择页Unload",
            }
        }
    }
    ],
};
export default tracks;