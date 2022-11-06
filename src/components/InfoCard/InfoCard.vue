<template>
    <v-card id="infocard" :class="{open:$store.getters.OPENINFO}">
        <v-icon @click="onclick" style="position: absolute; top: 10px; right: 50px;">mdi-close</v-icon>
        <router-view/>
    </v-card>
</template>

<script>
    export default {
        name: "InfoCard",
        data:()=>({
            open: false
        }),
        computed: {
            id(){
                return this.$route.params.id;
            }
        },
        methods:{
            onclick(){
                this.$router.push('/map')
            }
        },
        watch:{
            id(newval, oldval){
                if(newval){
                    this.$store.commit('OPENINFO')
                } else {
                    this.$store.commit('CLOSEINFO')
                }
            }
        }

    }
</script>


<style scoped>
    #infocard{
        --infoWidth: 300px;
        width: var(--infoWidth);
        position: fixed;
        right:0;
        top: 48px;
        height: 100%;
        transition: transform .3s ease;
        transform: translateX(300px);
        overflow-x: hidden;
    }
    #infocard.open{
        transform: translateX(0px);
    }
</style>