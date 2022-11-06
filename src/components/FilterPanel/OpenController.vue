<template>
    <div class="d-flex justify-center align-center">
        <v-icon id="arrow" @click="onclick">mdi-chevron-left</v-icon>
    </div>
</template>

<script>
    export default {
        name: "OpenController",
        methods:{
            onclick(){
                if(this.$store.getters.OPEN){
                    this.$store.commit('CLOSE')
                } else {
                    this.$store.commit('OPEN')
                }
            }
        }
    }
</script>

<style scoped>
    #arrow{
        transition: transform .6 ease;
    }
    .open>div>#arrow{
        transform: rotate(0);
    }
    :not(.open)>div>#arrow{
        transform: rotate(.5turn);
    }
</style>