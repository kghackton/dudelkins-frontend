<template>
    <v-sheet id="filterPanel" class="d-flex" :class="{open:$store.getters.OPEN}" elevation="15" >
        <Filters/>
        <v-divider vertical dark/>
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
        background-color: var(--col-1);
        --filterWidth: 286px;
        max-width: var(--filterWidth);
        position: fixed;
        left:0;
        top: 100px;
        height: 600px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        transition: transform .3s ease;
        transform: translateX(-262px);
    }
    #filterPanel.open{
        transform: translateX(0px);
    }

</style>