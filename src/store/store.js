import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {Auth} from './auth'

// import {MapExpert} from "./expert";
import {Map} from "../components/map/Map"
import filter from "./filter";
import Events from "../components/table/TE";
// import SourceLoader from "./resourceLoader";

export default new Vuex.Store({
    state:()=>({
        open: true,
        openInfo: false
    }),
    getters:{
        OPEN:state=>state.open,
        OPENINFO:state=>state.openInfo,
    },
    mutations:{
        OPEN:(state)=>{
            state.open = true
        },
        CLOSE:state=>{state.open = false},
        OPENINFO:(state)=>{
            state.openInfo = true
        },
        CLOSEINFO:state=>{state.openInfo = false}
    },
    modules: {
        Auth,
        Map,
        filter,
        Events,

        // MapExpert,
        // SourceLoader
    }
})