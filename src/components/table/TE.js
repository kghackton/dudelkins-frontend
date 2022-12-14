
import * as API from "@/api";

export default {
    state: {
        events: [],
        shouldload: true,
        totalevents: 0,
    },

    getters: {
        EVENTS: state => state.events,
        EVENTS_TOTAL: state => state.totalevents,
        EVENTS_ACTIVEOPTIONS: (state,getters) => ({
            from: getters.FILTER_STARTTIME?.toISOString(),
            to: getters.FILTER_ENDTIME?.toISOString(),
            region: getters.FILTER_REGION,
            categoryId: getters.FILTER_CATEGORIES,
            anomalyClass: getters.FILTER_ANOMALY_CLASSES
        }),
        EVENTS_SERVERBULKSIZE:()=>100,
        EVENTS_CLIENTBULKSIZE:()=>50,
        EVENTS_SHOULDLOAD:(state)=>state.shouldload,
    },
    mutations: {
        EVENTS_REWRITE: (state, data) => {
            if(data.length===0){
                state.shouldload = false
            }
            state.events = data
        },
        EVENTS_ADD: (state, newEvents) => {
            if(newEvents.length>0) {
                newEvents.forEach(ne => {
                    const clone = state.events.find(x => x.number === ne.number)
                    if (clone) {
                        for (let key in clone) {
                            clone[key] = ne[key]
                        }
                    } else {
                        state.events.push(ne)
                    }
                })
            } else {
                state.shouldload = false
            }
        },
        EVENTS_SHOULDLOAD_SET:(state, val)=>{
           state.shouldload = !!val
        }
    },
    actions: {
        EVENTS_GET:({commit, getters, dispatch}, payload)=>{
            return API.getAnom(payload)
                .then(arr=>{
                    if(arr.length===0){
                        commit('EVENTS_SHOULDLOAD_SET', false)
                    }
                    return arr
                })
        },
        EVENTS_RESTOLIST:({commit}, payload)=>{
            const events = payload?.data?.events
            if(!events.length){
                commit('EVENTS_SHOULDLOAD_SET', false)
            }
            return payload?.data?.events || []
        }
    }
}
