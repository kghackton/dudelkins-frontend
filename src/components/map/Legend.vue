<template>
    <div id="legend" style="overflow-y: auto">
        <div class="d-flex align-center pa-2">
            <p class="mr-auto">
                {{mode === 'list' ? 'Фильтр нарушений' : 'Легенда'}}
            </p>
            <p class="pr-1">{{$store.getters.MAP_EVENTS_FILTERED.length}}</p>
            <v-icon dark
                    @click="changemod"
                    class="inactive"
            >
                {{mode === 'list' ? mdiCog : mdiFormatListBulleted}}
            </v-icon>
        </div>
        <div v-if="mode === 'list'" id="legend--filter">
            <Checkbox
                    dense
                    hide-details
                    v-for="category in categoriesList"
                    :key="category"
                    :label="category"
                    :value="$store.getters.MAP_FILTER_CATEGORIES.includes(category)"
                    @handler = "(newval)=>{onclick(newval, category)}"
            />
        </div>
        <div v-if="mode === 'legend'">
            <div v-for="category in categoriesList.filter(cat=>$store.getters.MAP_FILTER_CATEGORIES.includes(cat))"
                 :key="category"
                 class="d-flex align-center justify-start mt-1 pt-1"
                 style="min-height: 28px"
            >
                <div class="legend-marker"
                     :style="`background-color:${category.color};`"
                />
                <p class="ml-3 text-left legend-text">{{category}}</p>
            </div>

        </div>

    </div>
</template>

<script>
    import Checkbox from "../wrappers/Checkbox";
    import {mdiCog, mdiFormatListBulleted} from "@mdi/js"
    export default {
        name: "Legend",
        components: {Checkbox},
        data:()=>({
            mdiCog, mdiFormatListBulleted,
            mode: 'legend'
        }),
        computed:{
            categoriesList(){
                return ['Трубы горят', 'Душа болит']
            }
        },
        mounted() {
            this.$store.commit('MAP_FILTER_CATEGORIES_ADD', this.categoriesList)
        },
        methods:{
            onclick(newval, labelUuid){
                if(newval){
                    this.$store.commit('MAP_FILTER_CATEGORIES_ADD', labelUuid)
                }
                if(!newval){
                    this.$store.commit('MAP_FILTER_CATEGORIES_REMOVE', labelUuid)
                }
            },
            changemod(){
                this.mode = this.mode==='legend' ? 'list' : 'legend'
            }
        },
    }
</script>

<style>
    #legend{
        height: var(--legendHeight);
        font-size: 12px;
    }

    .legend-marker{
        min-width:16px;
        min-height:16px;
        border: white;
        border-radius: 50%;
        border:white 1px solid;
        margin-left: 4px;
    }
    .legend-text{
        line-height: 20px;
        letter-spacing: normal;
    }
    #legend #legend--filter .v-input--checkbox .v-label{
        font-size: 12px;
    }
</style>