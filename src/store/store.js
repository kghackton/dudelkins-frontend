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
        open: true
    }),
    getters:{
        OPEN:state=>state.open,
    },
    mutations:{
        OPEN:(state)=>{
            state.open = true
        },
        CLOSE:state=>{state.open = false}
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