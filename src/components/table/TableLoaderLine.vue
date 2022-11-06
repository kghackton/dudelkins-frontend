<template>
    <tr class="v-data-table__progress" v-if="isLoading" id="tableLoading">
        <th :colspan="999" class="column">
            <div role="progressbar" aria-valuemin="0" aria-valuemax="100" class="v-progress-linear v-progress-linear--absolute v-progress-linear--visible theme--dark" style="height: 4px;">
                <div class="v-progress-linear__background primary" style="opacity: 0.3; left: 0%; width: 100%;"></div>
                <div class="v-progress-linear__buffer"></div>
                <div class="v-progress-linear__indeterminate v-progress-linear__indeterminate--active">
                    <div class="v-progress-linear__indeterminate long primary"></div>
                    <div class="v-progress-linear__indeterminate short primary"></div>
                </div>
            </div>
        </th>
    </tr>
</template>

<script>
    export default {
        name: "TableLoaderLine",
        props:{
            type:{
                type: String,
                required: true,
            }
        },
        computed:{
            isLoading(){
                switch (this.type) {
                    case 'chron':
                        return this.$store.getters['TASKS_DICT/LOADING'] ||
                            this.$store.getters['SOURCES_DICT/LOADING'] ||
                            this.$store.getters['CHRON_LOADING'] ||
                            this.$store.getters['ORACLE_DICT/LOADING'] ||
                            !this.$store.getters.CHRON_LIST
                    default:
                        return this.$store.getters[`${this.type}/LOADER_LOADING`]
                }

            }
        },
    }
</script>

<style scoped>
    #tableLoading .primary{
        background-color: var(--primary) !important;
        border-color: var(--primary) !important;
    }
</style>