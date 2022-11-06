import store from "./store";
import * as API from '@/api'
export default ()=>({
    activeoptions:()=> ({
        ...store.getters.EVENTS_ACTIVEOPTIONS
    }),
    clientbulksize: store.getters.EVENTS_CLIENTBULKSIZE,
    serverbulksize: store.getters.EVENTS_SERVERBULKSIZE,
    shouldload: ()=>store.getters.EVENTS_SHOULDLOAD,
    rewrite: (payload) => store.commit('EVENTS_REWRITE', payload),
    add: (payload) => store.commit('EVENTS_ADD', payload),
    get: (payload) => store.dispatch('EVENTS_GET', payload),
    oninit:()=> {
        store.commit('EVENTS_SHOULDLOAD_SET', true)
        return Promise.resolve(null)
    },
    activelist: () => store.getters.EVENTS,
    restolist: res=>res

})
