import dayjs from "dayjs";
export default {
    state: ()=>({
        searchstr:'',
        starttime: new Date(dayjs(new Date()).format('YYYY-MM-DDT00:00:00'+'Z')),
        endtime: new Date(dayjs(new Date()).format('YYYY-MM-DDT23:59:59'+'Z')),
        labelUuids:[],
        activeSourcesUuids:[],
    }),
    getters:{
        MAP_FILTER_SEARCHSTR: state=> state.searchstr,
        MAP_FILTER_STARTTIME: state=> state.starttime,
        MAP_FILTER_ENDTIME: state=> state.endtime,
        MAP_FILTER_LABELS: state => state.labelUuids,
        MAP_FILTER_ACTIVESOURCES: state => state.activeSourcesUuids,
    },
    mutations:{
        MAP_FILTER_SEARCHSTR_SET: (state, newval) => {state.searchstr = newval},

        MAP_FILTER_LABELS_ADD: (state, newLabel) => {
            const newLabels = [newLabel].flatMap(x=>x)
            state.labelUuids = [...(new Set([...state.labelUuids, ...newLabels]))]
        },
        MAP_FILTER_LABELS_REMOVE: (state, label) => {
            const index = state.labelUuids.indexOf(label);
            if (index !== -1) { state.labelUuids.splice(index, 1) }
        },
        MAP_FILTER_ACTIVESOURCES_ADD:(state, sourceUuid)=>{
            if (!state.activeSourcesUuids.includes(sourceUuid)) {
                state.activeSourcesUuids = [...state.activeSourcesUuids, sourceUuid]
            }
        },
        MAP_FILTER_ACTIVESOURCES_REMOVE:(state, sourceUuid)=>{
            const index = state.activeSourcesUuids.indexOf(sourceUuid);
            if (index !== -1) {state.activeSourcesUuids.splice(index, 1)}
        },
        MAP_FILTER_ACTIVESOURCES_CLEAR: (state)=>{
            state.activeSourcesUuids = []
        },

        MAP_FILTER_STARTTIME_SET: (state, newval) => {
            state.starttime = newval
        },
        MAP_FILTER_ENDTIME_SET: (state, newval) => {
            state.endtime = newval
        },
    },
    actions:{
        MAP_FILTER_ACTIVESOURCES_ADD:({getters, commit, dispatch }, sourceUuid)=>{
            commit('MAP_FILTER_ACTIVESOURCES_ADD', sourceUuid)
            return dispatch('MAP_EVENTS_SOURCE_ADD', sourceUuid)
        },
        // MAP_FILTER_STARTTIME_SET: ({getters, commit, dispatch }, newval) => {
        //     commit('MAP_FILTER_STARTTIME_SET', newval)
        //     dispatch('MAP_FILTER_TIME_ONCHANGE')
        // },
        // MAP_FILTER_ENDTIME_SET: ({getters, commit, dispatch }, newval) => {
        //     commit('MAP_FILTER_ENDTIME_SET', newval)
        //     dispatch('MAP_FILTER_TIME_ONCHANGE')
        // },
        MAP_FILTER_TIME_SET:({getters, commit, dispatch }, {start, end})=>{
            commit('MAP_FILTER_STARTTIME_SET', start)
            commit('MAP_FILTER_ENDTIME_SET', end)
            dispatch('MAP_FILTER_TIME_ONCHANGE')
        },


        MAP_FILTER_TIME_ONCHANGE: ({getters, commit, dispatch })=>{
            commit('MAP_EVENTS_CLEAR')
            getters.MAP_FILTER_ACTIVESOURCES.forEach(srcUuid=>{
                dispatch('MAP_FILTER_ACTIVESOURCES_ADD', srcUuid)
            })
            const tracksUuids = getters.MAP_TRACKS
            dispatch('MAP_TRACKS_CLEAR')
            tracksUuids.reduce((prom, trackUuid)=>{
                return prom.then(()=>dispatch('MAP_TRACK_ADD', trackUuid))
            }, Promise.resolve(null))
        }
    }
}


