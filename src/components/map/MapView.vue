<template>
    <v-row no-gutters id="mapView" style="height: 100%">
<!--        <MapExpertDialogWrapper/>-->
        <v-col id="mapWrapper">
            <ClusterSwitcher style="position: absolute; bottom: 20px; left: 15px; z-index: 1"/>
            <div id="map">

            </div>
        </v-col>
        <InfoCard/>
    </v-row>
 </template>

<script>

    import * as API from '@/api'
    import {mdiRefresh} from '@mdi/js'
    import ClusterSwitcher from "./ClusterSwitcher";
    // import MapExpertDialogWrapper from "./MapExpertDialogWrapper";
    import IconButton from "../IconButton";
    import InfoCard from "../InfoCard/InfoCard";
    export default {
        name: 'MapView',
        data:()=>({mdiRefresh}),
        components: {
            InfoCard,
            // MapExpertDialogWrapper,
            ClusterSwitcher,
            IconButton,
        },

        mounted() {
            this.$store.dispatch('MAP_INIT')
        },
        destroyed() {
            // this.$store.dispatch('MAP_CLEAR')
        },
        methods:{
        },
        watch:{
            '$store.getters.MAP_EVENTS_FILTERED_FEATURED'(){
                this.$store.dispatch('MAP_SHOW_EVENTS') //ставит актуальные точки в сорсы
            },
            '$store.getters.FILTER_STARTTIME'(){
                this.$store.commit('MAP_EVENTS_CLEAR')
                this.$store.dispatch('MAP_EVENTS_INIT')
            },
            '$store.getters.FILTER_ENDTIME'(){
                this.$store.commit('MAP_EVENTS_CLEAR')
                this.$store.dispatch('MAP_EVENTS_INIT')
            },
            '$store.getters.FILTER_ANOMALY_CLASSES'(){
                this.$store.commit('MAP_EVENTS_CLEAR')
                this.$store.dispatch('MAP_EVENTS_INIT')
            }
            // '$store.getters.ANIM_POINTS'(){
            //     const src = this.$store.getters.MAP.getSource('events-new-animation')
            //     if(src){
            //         src.setData({
            //             type: 'FeatureCollection',
            //             features: this.$store.getters.ANIM_FEATURES,
            //         })
            //     }
            // }
            // '$store.getters.MAP_ONLINE_MODE'(newval, oldval){
                // if(newval && !oldval){
                //     console.log(update)
                // }
            // }
        }
    }
</script>

<style lang="scss">

    #mapView {
        & #map{
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            overflow: hidden;
            & .mapboxgl-control-container {
                display: none;
            }
            &>div{
                position: absolute;
                &>canvas{
                    position: absolute;
                }
            }
        }
    }

    div.donut{
        &>svg{
            cursor: pointer;
        }

    }
</style>
