<template>
    <v-btn max-width="45px" depressed @click="onclick" :style="`background-color: ${isHeatOn ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,0.3)'}`">
        <v-img max-width="40px" contain src="../../../public/pngegg.png"/>
    </v-btn>
</template>

<script>
    export default {
        name: "heatmapBut",
        data:()=>({
            isHeatOn:false,
        }),
        methods:{
            onclick(){
                if(this.isHeatOn){
                    this.$store.dispatch("MAP_HEATMAP_OFF")
                }
                else{
                    this.$store.dispatch("MAP_HEATMAP_ON")
                }
                this.isHeatOn = !this.isHeatOn
            }
        },
    }
</script>

<style scoped>

</style>