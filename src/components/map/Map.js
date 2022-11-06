import mapboxgl from 'mapbox-gl';
import {Map_Events} from "./Map_Events";
import MapAO from "./MapAO";

export const Map = {
    strict: false,
    state: ()=>({
        map:null,
        mode: 'cluster',
        regions:['ЮВАО', 'СЗАО'],
        loading: false,
        TOKEN: 'pk.eyJ1Ijoienlrb3ZuaWtpdGEiLCJhIjoiY2txaHphMGtiMGdzeDJwbngyMHBpenkxNyJ9.nGdPsGilgFczHXqGOPbc3g',
    }),
    getters: {
        MAP: state => state.map,
        MAP_MODE: state=>state.mode,
        MAP_LOADING: state => state.loading,
        MAP_REGIONS: state => state.regions,
        MAP_TOKEN: state => state.TOKEN,
    },
    mutations: {
        MAP_INIT:(state)=>{
            mapboxgl.accessToken = state.TOKEN;
            state.map = new mapboxgl.Map({
                container: 'map', // container ID
                // projection: 'globe',
                // style: 'mapbox://styles/mapbox/satellite-v9',
                style: 'mapbox://styles/zykovnikita/ckqqq8fng3k3517mna99hnaai',
                center: [37.62, 55.75], // starting position [lng, lat] Moscow
                zoom: 12
            });
        },
        MAP_MODE_SET: (state, val)=> {
            if (!['cluster', 'heatmap'].includes(val)) {
                alert('Неизвестный тип карты')
            }
            state.mode = val
        },

        MAP_STARTLOADING: (state)=>{
            state.loading = true
        },
        MAP_STOPLOADING: (state)=>{
            state.loading = false
        },
    },
    actions: {
        MAP_INIT({commit, dispatch, getters}){
            commit('MAP_INIT')
            getters.MAP.on('load',() => {
                dispatch('MAP_EVENTS_INIT')
                dispatch('MAP_AO_INIT')
            })
        },
        MAP_CLEAR:({commit, dispatch, getters})=>{
            commit('MAP_EVENTS_CLEAR')
        },
        MAP_CENTER_TO:({getters}, coords)=>{
            getters.MAP.easeTo({
                center: coords,
                curve: 1,
                screenSpeed: .35,
                zoom: 15
            });
        },
    },
    modules:{
        Map_Events,
        MapAO,
    }
}


