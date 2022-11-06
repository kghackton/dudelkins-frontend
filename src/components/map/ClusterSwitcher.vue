<template>
<!--    <v-btn-toggle dark style="width: 96px">-->
    <div class="d-flex align-center">
        <div id="heatmapBut" data-tooltip="Тепловая карта">
            <v-btn active-class="isHeatOn" :class="{isHeatOn: mode==='heatmap'}"  max-width="45px" depressed @click="onheatclick"
                   :style="`background-color: ${mode==='heatmap' ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,0.3)'}`">
                <v-img max-width="40px" contain src="../../../public/pngegg.png"/>
            </v-btn>
        </div>
        <div id="clusterBut" data-tooltip="Кластеризация">
            <v-btn active-class="isClusterOn" :class="{isClusterOn: mode === 'cluster'}" max-width="45px" depressed @click="onclusterclick"
                   :style="`background-color: ${mode === 'cluster' ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,0.3)'}`">
                <v-icon width="40px" color="white">
                    {{'$cluster'}}
                </v-icon>
            </v-btn>
        </div>

    </div>
<!--    </v-btn-toggle>-->
</template>

<script>
    export default {
        name: "ClusterSwitcher",
        computed:{
            mode:{
                get(){
                    return this.$store.getters.MAP_MODE
                },
                set(val){
                    this.$store.commit('MAP_MODE_SET', val)
                }
            },
        },
        methods:{
            onheatclick(){
                switch (this.mode) {
                    case 'cluster':
                        this.heatOn()
                        break;
                    case 'heatmap':
                        break;
                    default:
                        notify({theme: "error", text: 'Карта: неизвестный режим'})
                        break;
                }
            },
            onclusterclick(){
                switch (this.mode) {
                    case 'cluster':
                        break;
                    case 'heatmap':
                        this.clusterOn()
                        break;
                    default:
                        notify({theme: "error", text: 'Карта: неизвестный режим'})
                        break;
                }
            },
            heatOn(){
                this.$store.dispatch("MAP_HEATMAP_ON")
                this.$store.dispatch("MAP_CLUSTERS_OFF")
                this.mode = 'heatmap'
            },
            clusterOn(){
                this.$store.dispatch("MAP_HEATMAP_OFF")
                this.$store.dispatch("MAP_CLUSTERS_ON")
                this.mode = 'cluster'
            }
        }
    }
</script>

<style scoped>
    #heatmapBut:after{
        width: 100px;
        margin-top: 5px;
    }
    #clusterBut:after{
        width: 100px;
        margin-top: 5px;
        margin-right: 5px;
    }
</style>