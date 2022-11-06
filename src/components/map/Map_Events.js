import * as API from '@/api'
import Vue from 'vue'
import mapboxgl from 'mapbox-gl';
import labels from "@/plugins/labels.json"

import * as SVG from "@/plugins/MapSvg"

import Popup from "./Popup";

export const Map_Events = {
    state: {
        events: [],//массив

        // loadingSources:[], //id сорсов, по которым производится загрузка

        markers:{},
        markersOnScreen:{},
    },
    getters: {
        MAP_EVENTS: state => state.events,

        MAP_LABELS_COLOR_LIST: (state)=>([
            [1, 'red'],
            [2, 'blue'],
            [3, 'yellow'],
            [4, 'green'],
            [5, 'pink'],
            [6, 'orange']]
        ),
        MAP_EVENTS_FILTERED: (state, getters)=> {
            return getters.MAP_EVENTS.reduce((filtered, event)=>{
                // if (getters.FILTER_REGION){ //TODO: вернуть после фильтров
                //     if (getters.FILTER_REGION !== event.region){
                //         return filtered
                //     }
                // }
                // if (getters.FILTER_CATEGORIES.length!==0){ //TODO: прописать условия на категории
                //     if (false){
                //         return filtered
                //     }
                // }
                if(!event.gps){
                    return filtered
                }

                const anomalyClasses = Object.entries(event.anomalyClasses).filter(([anomClass, info])=>{
                    return true || anomClass in getters.FILTER_ANOMALY_CLASSES //TODO: вернуть после фильтров
                }).reduce((acc,[anomClass, info])=>{
                    acc[anomClass] = info
                    return acc
                },{})
                if (Object.keys(anomalyClasses).length === 0){
                    return filtered
                }
                filtered.push(Object.assign({}, event, {anomalyClasses}))
                return filtered
            }, [])

        },
        MAP_EVENTS_FILTERED_FEATURED:(state, getters)=>{
            const events = getters.MAP_EVENTS_FILTERED
            const eventsAcc = events.reduce((acc, event )=>{
                const UNOM = event.UNOM
                if(UNOM in acc){
                    acc[UNOM].push(event)
                } else {
                    acc[UNOM] = [event]
                }
                return acc
            }, {})

            const res = Object.entries(eventsAcc).map(([UNOM, events])=>{

                const anomalyCount = events.reduce((acc, event)=>{
                    Object.keys(event.anomalyClasses).forEach(anomClass=>{
                        switch (anomClass) {
                            case 'closed without completion for same applicant':
                                acc.closedWithoutCompletionForSameApplicant++
                                break;
                            case 'closed too fast':
                                acc.closedTooFast++
                                break;
                            case 'closed with completion but without returnings for same applicant':
                                acc.closedWithCompletionButWithoutReturningsForSameApplicant++
                                break;
                            case 'bad review':
                                acc.badReview++
                                break;
                            case 'deviation':
                                acc.deviation++
                                break;
                            case 'closed for less than 10 minutes with no returnings':
                                acc.closedForLessThan10MinutesWithNoReturnings++
                                break;
                            case 'with returnings':
                                acc.withReturnings++
                                break;
                            default:
                                console.log('Unknown Class', anomClass)
                        }
                    })
                    return acc
                }, {
                    closedWithoutCompletionForSameApplicant: 0,
                    closedTooFast: 0,
                    closedWithCompletionButWithoutReturningsForSameApplicant: 0,
                    badReview: 0,
                    deviation: 0,
                    closedForLessThan10MinutesWithNoReturnings:0,
                    withReturnings: 0,
                })

                return {
                    "type": "Feature",
                    "properties": {
                        UNOM,
                        eventsCount: events.length,
                        events,
                        ...anomalyCount
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            events[0].gps.latitude,
                            events[0].gps.longitude
                        ]
                    },

                }
            })
            return res
        },
        // MAP_EVENTS_SOURCE_IS_LOADING:(state)=>(sourceId)=>state.loadingSources.includes(sourceId),
        MARKERS:state=>state.markers,
        MARKERS_ON_SCREEN: state=>state.markersOnScreen,

    },
    mutations: {
        MARKER_SET:(state, {id, newmarker})=>{
            Vue.set(state.markers, id, newmarker)
        },
        MARKERS_ON_SCREEN_SET:(state,  newmarkers)=>{
            state.markersOnScreen = newmarkers
        },

        MAP_EVENTS_SET: (state, events)=>{
            state.events = events
        },
        MAP_EVENTS_CLEAR: (state)=>{
            state.events = {}
        },
        MAP_SHOW_EVENTS: (state, getters)=>{
            const clust = getters.MAP.getSource('events-clustered')
            if(clust){
                clust.setData({
                    type:'FeatureCollection',
                    features: getters.MAP_EVENTS_FILTERED_FEATURED
                })
            }
            const single = getters.MAP.getSource('events-single')
            if(single) {
                single.setData({
                    type: 'FeatureCollection',
                    features: getters.MAP_EVENTS_FILTERED_FEATURED
                });
            }
        },

        // MAP_EVENTS_ADD_TO_LIST:(state, {getters, commit, images})=>{
        //     images.forEach( img=>{
        //         if(!state.images[img.uuid]){ //если это новый image -> добавляем его в словарик
        //             const cameraId = img.info.odh.cameraId
        //             const camera = img.source.info.odh.carCameras.find(cam=>cam.uuid === cameraId)
        //             const imageInfo = {
        //                 uuid: img.uuid,
        //                 width: img.width,
        //                 height: img.height,
        //                 gps: {
        //                     latitude: img.info.latitude,
        //                     longitude: img.info.longitude,
        //                 },
        //                 createdAt: img.info?.timestamp || null,
        //                 sourceUuid: img.source.uuid,
        //                 source: img.source,
        //                 camera
        //             }
        //             state.images[img.uuid] = imageInfo
        //         }
        //
        //         img.events.forEach(ev => {
        //             const labelUuid = ev.labelUuid
        //             const eventInfo = {
        //                 uuid: ev.uuid,
        //                 imageUuid: ev.imageUuid,
        //                 labelUuid,
        //                 results: ev.results
        //             }
        //             if(state.events[img.source.uuid] && state.events[img.source.uuid][labelUuid]){
        //                 Vue.set(state.events[img.source.uuid],labelUuid, [...state.events[img.source.uuid][labelUuid], eventInfo])
        //             }
        //             if(!state.events[img.source.uuid]){
        //                 state.events[img.source.uuid] = {}
        //             }
        //             if(!state.events[img.source.uuid][labelUuid]){
        //                 Vue.set(state.events[img.source.uuid], labelUuid, [eventInfo])
        //                 // state.events[img.source.uuid][labelUuid] = [eventInfo]
        //             }
        //         })
        //     })
        //     Vue.set(state, 'events', JSON.parse(JSON.stringify(state.events))/*events*/)
        //
        //
        // },
        // MAP_EVENTS_SOURCE_LOADING_SET: (state, {sourceId, newLoading})=>{
        //     if (newLoading && !state.loadingSources.includes(sourceId)){
        //         state.loadingSources.push(sourceId)
        //     }
        //
        //     if(!newLoading && state.loadingSources.includes(sourceId)){
        //         state.loadingSources = state.loadingSources.filter(src=>src!==sourceId)
        //     }
        // }
    },
    actions:{
        MAP_SET_POPUP:({getters})=>{
            const handler = (event) => {
                console.log(event.features[0].geometry.coordinates)
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(Popup(event))
                    .addTo(getters.MAP);
            }
            getters.MAP.on('click', 'events-point', handler );
        },
//         MAP_SET_CLUSTER_ONCLICK:({getters, commit, dispatch})=>{
//             getters.MAP.on('click', 'events-clustered', (e) => {
//                 const features = getters.MAP.queryRenderedFeatures(e.point, {
//                     layers: ['events-clustered']
//                 });
//                 const clusterId = features[0].properties.cluster_id;
// // Ease the camera to the next cluster expansion
//                 getters.MAP.getSource('events-clustered').getClusterExpansionZoom(
//                     clusterId,
//                     (err, zoom) => {
//                         if (!err) {
//                             getters.MAP.easeTo({
//                                 center: features[0].geometry.coordinates,
//                                 zoom
//                             });
//                         }
//                     }
//                 );
//             });
//         },

        MAP_EVENTS_INIT: ({commit, dispatch, getters})=>{

            API.getAnom({}).then(anomArr=>{
                commit('MAP_EVENTS_SET', anomArr)
            })

            getters.MAP.addSource('events-clustered', {
                'type': 'geojson',
                'data': {
                    "type": "FeatureCollection",
                    "features": [],
                },
                cluster: true,
                clusterMaxZoom: 13, // Max zoom to cluster points on
                clusterRadius: 80,

                clusterProperties:{
                    eventsCount:['+', ['get', 'eventsCount']],
                    closedWithoutCompletionForSameApplicant:['+', ['get', 'closedWithoutCompletionForSameApplicant']],
                    closedTooFast:['+', ['get', 'closedTooFast']],
                    closedWithCompletionButWithoutReturningsForSameApplicant:['+', ['get', 'closedWithCompletionButWithoutReturningsForSameApplicant']],
                    badReview: ['+', ['get', 'badReview']],
                    deviation: ['+', ['get', 'deviation']],
                    closedForLessThan10MinutesWithNoReturnings: ['+', ['get', 'closedForLessThan10MinutesWithNoReturnings']],
                    withReturnings: ['+', ['get', 'withReturnings']],
                }
            });

            getters.MAP.addSource('events-single', {
                'type': 'geojson',
                'data': {
                    "type": "FeatureCollection",
                    "features": [],
                },
            });

            dispatch('MAP_CLUSTERS_ON')

            getters.MAP.on('render', () => {
                switch (getters.MAP_MODE) {
                    case 'cluster':
                        if (getters.MAP.isSourceLoaded('events-clustered')) {
                            dispatch('UPDATE_CLUSTER_MARKERS');
                            // dispatch('UPDATE_SINGLE_MARKERS');
                        }
                        return
                    case 'heatmap':
                        if (getters.MAP.isSourceLoaded('events-single')) {
                            dispatch('UPDATE_HEATMAP_MARKERS');
                        }
                        return
                    default:
                        return
                }
            });
        },

        // MAP_EVENTS_SOURCE_ADD:({commit,getters,dispatch}, newsource)=>{
        //     if(getters.MAP_EVENTS[newsource]){
        //         return Promise.resolve(getters.MAP_EVENTS[newsource])
        //     }
        //
        //     commit('MAP_EVENTS_SOURCE_LOADING_SET', {sourceId: newsource, newLoading: true})
        //
        //     const now = new Date()
        //     const start = getters.MAP_FILTER_STARTTIME ? new Date(getters.FILTER_STARTTIME) : null
        //     const end = getters.MAP_FILTER_ENDTIME ? new Date(getters.FILTER_ENDTIME) : null

            // return API.getimages({
            //     sourceUuids: [newsource],
            //     fromImageTimestamp: start,
            //     toImageTimestamp: end
            // }).then(res=>{
            //     const images = res.images
            //     console.log(`Добавлено ${images.length}, id: ${newsource}`)
            //     commit('MAP_EVENTS_ADD_TO_LIST', {
            //         getters,
            //         commit,
            //         images
            //     })
            //     return images
            // })
            //     .finally(()=>{commit('MAP_EVENTS_SOURCE_LOADING_SET', {sourceId: newsource, newLoading: false})})
        // },
        MAP_SHOW_EVENTS: ({getters, commit})=>{
            commit('MAP_SHOW_EVENTS', getters)
        },

        MAP_CLUSTERS_ON:({getters, dispatch})=>{
            getters.MAP.addLayer({ //TODO: разобраться, для чего вообще нужен. Видимо, без него карта оптимизируется и не пересчитывает сорс кластера
                id: 'unclustered-point',
                type: 'circle',
                source: 'events-clustered',
                filter: false,
            });
            dispatch('MAP_SHOW_EVENTS')
        },
        MAP_CLUSTERS_OFF:({getters})=>{
            // if(getters.MAP.getLayer('events-clustered')){
            //     getters.MAP.removeLayer('events-clustered')
            // }
            // if(getters.MAP.getLayer('cluster-count')) {
            //     getters.MAP.removeLayer('cluster-count')
            // }
            if(getters.MAP.getLayer('unclustered-point')) {
                getters.MAP.removeLayer('unclustered-point')
            }
        },

        MAP_HEATMAP_ON:({commit,getters,dispatch})=>{
            getters.MAP.addLayer({
                'id': 'events-point',
                'type': 'circle',
                'source': 'events-single',
                'filter': false
            })
            getters.MAP.addLayer({
                    'id': 'events-heat',
                    'type': 'heatmap',
                    'source': 'events-single',
                    'maxzoom': 15,
                    'paint': {
// increase weight as diameter breast height increases
//                             'heatmap-weight': {
//                                 'property': 'eventsCount',
//                                 'type': 'exponential',
//                                 'stops': [
//                                     [1, 0],
//                                     [62, 1]
//                                 ]
//                             },
// increase intensity as zoom level increases
//                             'heatmap-intensity': {
//                                 'stops': [
//                                     [13, 1],
//                                     [14, 2],
//                                     [15, 3]
//                                 ]
//                             },
// use sequential color palette to use exponentially as the weight increases
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0,
                            'rgba(0,222,0,0.15)',
                            0.2,
                            'rgb(90,78,26)',
                            0.4,
                            'rgb(160,130,40)',
                            0.5,
                            'rgb(203,169,57)',
                            0.7,
                            'rgb(250, 150,0)',
                            0.9,
                            'rgb(250, 150,0)',
                            1.09,
                            'rgb(228,44,53)',
                            1.1,
                            'rgb(106,0,0)'
                        ],
// increase radius as zoom increases
                        'heatmap-radius': {
                            'stops': [
                                [11, 8],
                                [15, 11]
                            ]
                        },
// decrease opacity to transition into the circle layer
                        'heatmap-opacity': {
                            'default': 1,
                            'stops': [
                                [14, 1],
                                [15, 0]
                            ]
                        }
                    }
                }, 'waterway-label');
            dispatch('MAP_SHOW_EVENTS')
        },
        MAP_HEATMAP_OFF:({commit,getters,dispatch})=>{
            if(getters.MAP.getLayer('events-point')){
                getters.MAP.removeLayer('events-point')
            }
            if(getters.MAP.getLayer('events-heat')) {
                getters.MAP.removeLayer('events-heat')
            }
        },

        UPDATE_CLUSTER_MARKERS({getters, commit}){
            const clickHandler = (clusterId, feature)=>(e) => {
                getters.MAP.getSource('events-clustered').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (!err) {
                            getters.MAP.easeTo({
                                center: feature.geometry.coordinates,
                                zoom
                            });
                        }
                    }
                );
            }

            const newMarkers = {};
            const features = getters.MAP.getSource('events-clustered')._data.features;

            for (const feature of features) {
                const props = feature.properties;
                if (props.cluster){
                    const coords = feature.geometry.coordinates;
                    const id = props.cluster_id;

                    let marker = (getters.MARKERS)[id];
                    if (!marker) {
                        const el = SVG.createDonutChart(props);
                        marker = new mapboxgl.Marker({
                            element: el
                        }).setLngLat(coords);
                        commit('MARKER_SET', {id, newmarker: marker})
                        el.addEventListener('click', clickHandler(id, feature))
                    }
                    newMarkers[id] = marker;


                    if (!getters.MARKERS_ON_SCREEN[id]) {
                        marker.addTo(getters.MAP)
                    }
                } else {
                    const coords = feature.geometry.coordinates;
                    // const info = JSON.parse(props.info)
                    const id = props.UNOM

                    let marker = (getters.MARKERS)[id];
                    if (!marker) {
                        const el = SVG.createPiePoint(props);
                        marker = new mapboxgl.Marker({
                            element: el
                        }).setLngLat(coords);
                        commit('MARKER_SET', {id, newmarker: marker})
                        el.addEventListener('click', function(event){
                            event.stopPropagation()
                            new mapboxgl.Popup({closeButton:false})
                                .setLngLat(coords)
                                .setHTML(Popup(props))
                                .addTo(getters.MAP);
                        })
                    }
                    newMarkers[id] = marker;
                    if (!getters.MARKERS_ON_SCREEN[id]) {
                        marker.addTo(getters.MAP)
                    }
                }

            }
            for (const id in getters.MARKERS_ON_SCREEN) {
                if (!newMarkers[id]) {
                    getters.MARKERS_ON_SCREEN[id].remove()
                }
            }
            commit('MARKERS_ON_SCREEN_SET', newMarkers)
        },

        UPDATE_HEATMAP_MARKERS({getters, commit}){
            const newMarkers = {};
            if(getters.MAP.getZoom() < 13){
                for (const id in getters.MARKERS_ON_SCREEN) {
                    getters.MARKERS_ON_SCREEN[id].remove()
                }
                commit('MARKERS_ON_SCREEN_SET', {})
                return
            }
            const features = getters.MAP.getSource('events-single')._data.features;
            for (const feature of features) {
                const props = feature.properties;
                const coords = feature.geometry.coordinates;
                const info = JSON.parse(props.info)
                const id = info.uuid
                let marker = (getters.MARKERS)[id];
                if (!marker) {
                    const el = SVG.createPiePoint(props);
                    marker = new mapboxgl.Marker({
                        element: el
                    }).setLngLat(coords);
                    commit('MARKER_SET', {id, newmarker: marker})
                    el.addEventListener('click', function(event){
                        event.stopPropagation()
                        new mapboxgl.Popup({closeButton:false})
                            .setLngLat(coords)
                            .setHTML(Popup(props))
                            .addTo(getters.MAP);
                    })
                }
                newMarkers[id] = marker;
                if (!getters.MARKERS_ON_SCREEN[id]) {
                    marker.addTo(getters.MAP)
                }
            }
            for (const id in getters.MARKERS_ON_SCREEN) {
                if (!newMarkers[id]) {
                    getters.MARKERS_ON_SCREEN[id].remove()
                }
            }
            commit('MARKERS_ON_SCREEN_SET', newMarkers)
        },
    }
}