<template>
    <v-sheet id="filterPanel" class="d-flex" :class="{open:$store.getters.OPEN}" elevation="15" >
        <Filters/>
        <v-divider vertical/>
        <OpenController/>
    </v-sheet>
</template>

<script>
    import Filters from "./Filters";
    import OpenController from "./OpenController";
    export default {
        name: "FilterPanel",
        components: {OpenController, Filters}
    }
</script>

<style scoped>
    #filterPanel{
        --filterWidth: 230px;
        position: fixed;
        left:0;
        top: 100px;
        height: 600px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        transition: transform .3s ease;
        transform: translateX(-230px);
    }
    #filterPanel.open{
        transform: translateX(0px);
    }

</style>