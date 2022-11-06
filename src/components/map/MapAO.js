import ao from '@/assets/ao.json'
export default{
    state:()=>({}),
    getters:{},
    mutations:{},
    actions:{
        MAP_AO_INIT: ({dispatch, getters})=>{
            getters.MAP.on('render', () => {

            });

            getters.MAP.addSource('ao_poly', {
                'type': 'geojson',
                'data': ao,
            });

            getters.MAP.addLayer({
                id: 'ao_poly',
                source: 'ao_poly',
                maxzoom: 11,
                'type': 'fill',
                'layout': {},
                'paint': {
                    'fill-color': ['get', 'color'],
                    'fill-opacity': 0.3
                }
            });
        },
    },
}